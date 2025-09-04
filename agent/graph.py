from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain.globals import set_debug, set_verbose
from agent.states import *
from agent.prompt import *
from langgraph.graph import StateGraph
from agent.tools import write_file, read_file, get_current_directory, list_files
from langgraph.prebuilt import create_react_agent
from langgraph.constants import END

# Load environment variables
load_dotenv()
set_debug(True)
set_verbose(True)

# Initialize LLM
llm = ChatGroq(model="openai/gpt-oss-120b")


def planner_agent(state: dict) -> dict:
    """Generates a Plan from the user prompt."""
    user_prompt = state["user_prompt"]
    res = llm.with_structured_output(Plan).invoke(planner_prompt(user_prompt))
    return {"plan": res}


def architect_agent(state: dict) -> dict:
    """Creates a TaskPlan from a Plan."""
    plan: Plan = state["plan"]

    resp = llm.with_structured_output(TaskPlan).invoke(
        architect_prompt(plan=plan.model_dump_json())
    )

    if resp is None:
        raise ValueError("Planner did not return a valid response.")

    resp.plan = plan
    print(resp.model_dump_json())
    return {"task_plan": resp}


def coder_agent(state: dict) -> dict:
    """LangGraph tool-using coder agent."""
    coder_state: CoderState = state.get("coder_state")
    print("Coder agent started")

    if coder_state is None:
        coder_state = CoderState(
            task_plan=state["task_plan"],
            current_step_idx=0
        )

    steps = coder_state.task_plan.implementation_steps

    if coder_state.current_step_idx >= len(steps):
        # Mark as done
        return {"coder_state": coder_state, "status": "Done"}

    current_task = steps[coder_state.current_step_idx]
    existing_content = read_file.run(current_task.filepath)

    system_prompt = coder_system_prompt()

    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )

    coder_tools = [read_file, write_file, list_files, get_current_directory]
    react_agent = create_react_agent(llm, coder_tools)

    react_agent.invoke({
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    })

    coder_state.current_step_idx += 1

    return {"coder_state": coder_state}


# Build the state graph
graph = StateGraph(dict)
graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)

graph.set_entry_point("planner")
graph.add_edge("planner", "architect")
graph.add_edge("architect", "coder")

# Conditional edges for looping coder agent until done
graph.add_conditional_edges(
    "coder",
    lambda state: END if state.get("status") == "Done" else "coder",
    {END: END, "coder": "coder"}
)

# Compile the agent
agent = graph.compile()


if __name__ == "__main__":
    user_prompt = (
        "Create a Simple Calculator web application using HTML, CSS, and JavaScript, "
        "and create a README file."
    )

    res = agent.invoke(
        {"user_prompt": user_prompt},
        {"recursion_limit": 100}
    )

    print("Result received:")
    print(res)
