# Prompt2Code

This project converts natural language prompts into code using AI agents and tools.

## Features
- Python backend for agent logic
- Web frontend in `generated_project/` (HTML, CSS, JS)
- Modular design with `agent/` for graph, prompt, states, and tools

## Project Overview
Prompt2Code is an AI-powered engineering project generator. It takes natural language prompts and produces a complete codebase, including backend logic and a web frontend.

## Architecture
- **Agent System:**
	- Modular agents: Planner, Architect, Coder
	- Uses LangChain, LangGraph, and Groq LLM for reasoning and code generation
	- Agents communicate via a state graph (`agent/graph.py`)
- **Tools:**
	- File operations, directory listing, and shell commands are abstracted in `agent/tools.py`
- **State Management:**
	- Project plans, implementation steps, and file purposes are modeled in `agent/states.py`
- **Prompts:**
	- Custom prompt templates for each agent in `agent/prompt.py`

## Web Frontend
- Located in `generated_project/`
- Includes a responsive Todo App (`index.html`, `styles.css`, `script.js`)
- Features: Add, edit, delete, filter, and persist todos in local storage

## Python Dependencies
- `groq`, `langchain`, `langchain-core`, `langchain-groq`, `langgraph`, `pydantic`, `python-dotenv`

## Usage
- Run `main.py` and enter a project prompt (e.g., "Create a Simple Calculator web application...")
- The agent system will generate code and project files automatically

## Configuration
- Set your Groq API key in `.env` (never commit secrets)
- Python version: 3.13+ (see `.python-version`)

## IDE Support
- `.idea/` folder for JetBrains IDEs (PyCharm, etc.)
- VS Code settings supported via `.vscode/`

## Extending
- Add new agent logic in `agent/`
- Extend frontend features in `generated_project/`

## Setup
1. Clone the repository
2. Install Python dependencies (see `pyproject.toml`)
3. Configure your environment variables in `.env` (do not commit secrets)
4. Start the backend: `python main.py`
5. Open `generated_project/index.html` in your browser

## Folder Structure
- `main.py` — Entry point for backend
- `agent/` — Core agent logic
- `generated_project/` — Web frontend

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
MIT
