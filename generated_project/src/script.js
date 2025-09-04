// src/script.js
// Todo application core logic
// ------------------------------------------------------------
// Todo model
class Todo {
  /**
   * @param {string|number} id
   * @param {string} text
   * @param {boolean} completed
   */
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }

  // Simple unique id generator – timestamp + random component
  static generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
}

// ------------------------------------------------------------
// Main application class
class TodoApp {
  constructor() {
    /** @type {Todo[]} */
    this.todos = [];
    /** @type {'all'|'active'|'completed'} */
    this.filter = 'all';

    // Cache DOM references
    this.todoListEl = document.getElementById('todo-list');
    this.newTodoInput = document.getElementById('new-todo');
    this.addTodoBtn = document.getElementById('add-todo');
    this.remainingCountEl = document.getElementById('remaining-count');
    this.filterButtons = {
      all: document.getElementById('filter-all'),
      active: document.getElementById('filter-active'),
      completed: document.getElementById('filter-completed'),
    };

    this._setupEventListeners();
  }

  // -----------------------------------------------------------------
  // Persistence
  loadFromStorage() {
    const raw = localStorage.getItem('todos');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Ensure we recreate Todo instances
        this.todos = parsed.map(item => new Todo(item.id, item.text, item.completed));
      } catch (e) {
        console.error('Failed to parse todos from storage', e);
        this.todos = [];
      }
    }
  }

  saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  // -----------------------------------------------------------------
  // CRUD operations
  addTodo(text) {
    if (!text.trim()) return;
    const todo = new Todo(Todo.generateId(), text.trim(), false);
    this.todos.push(todo);
    this._afterDataChange();
  }

  editTodo(id, newText) {
    const todo = this.todos.find(t => t.id === id);
    if (todo && newText.trim()) {
      todo.text = newText.trim();
      this._afterDataChange();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this._afterDataChange();
  }

  toggleComplete(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this._afterDataChange();
    }
  }

  // -----------------------------------------------------------------
  // Filtering
  setFilter(filter) {
    if (['all', 'active', 'completed'].includes(filter)) {
      this.filter = /** @type {'all'|'active'|'completed'} */ (filter);
      this.render();
    }
  }

  getFilteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  // -----------------------------------------------------------------
  // Rendering
  render() {
    // Clear list
    this.todoListEl.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const todosToShow = this.getFilteredTodos();

    todosToShow.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (todo.completed) li.classList.add('completed');
      li.dataset.id = todo.id;

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.className = 'todo-checkbox';
      checkbox.setAttribute('aria-label', 'Mark todo as completed');

      // Text span
      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit todo');

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'delete-btn';
      delBtn.textContent = 'Delete';
      delBtn.setAttribute('aria-label', 'Delete todo');

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      fragment.appendChild(li);
    });

    this.todoListEl.appendChild(fragment);
    this._updateRemainingCount();
    this._updateFilterButtonsUI();
  }

  // -----------------------------------------------------------------
  // UI helpers
  _updateRemainingCount() {
    const remaining = this.todos.filter(t => !t.completed).length;
    this.remainingCountEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
  }

  _updateFilterButtonsUI() {
    Object.entries(this.filterButtons).forEach(([key, btn]) => {
      if (key === this.filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Called after any data mutation – persist and re‑render
  _afterDataChange() {
    this.saveToStorage();
    this.render();
  }

  // -----------------------------------------------------------------
  // Event wiring
  _setupEventListeners() {
    // Add via button click
    if (this.addTodoBtn) {
      this.addTodoBtn.addEventListener('click', () => {
        this.addTodo(this.newTodoInput.value);
        this.newTodoInput.value = '';
      });
    }

    // Input key handling (Enter adds, Escape clears)
    if (this.newTodoInput) {
      this.newTodoInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          this.addTodo(this.newTodoInput.value);
          this.newTodoInput.value = '';
        } else if (e.key === 'Escape') {
          this.newTodoInput.value = '';
        }
      });
    }

    // Filter buttons
    Object.entries(this.filterButtons).forEach(([key, btn]) => {
      btn.addEventListener('click', () => this.setFilter(/** @type any */ (key)));
    });

    // Delegated events on the todo list
    this.todoListEl.addEventListener('change', e => {
      const target = /** @type HTMLElement */ (e.target);
      if (target.matches('input.todo-checkbox')) {
        const li = target.closest('li.todo-item');
        if (li) this.toggleComplete(li.dataset.id);
      }
    });

    this.todoListEl.addEventListener('click', e => {
      const target = /** @type HTMLElement */ (e.target);
      const li = target.closest('li.todo-item');
      if (!li) return;
      const id = li.dataset.id;

      if (target.matches('button.delete-btn')) {
        this.deleteTodo(id);
      } else if (target.matches('button.edit-btn')) {
        this._enterEditMode(li, id);
      }
    });
  }

  // -----------------------------------------------------------------
  // Edit mode handling
  _enterEditMode(li, id) {
    const span = li.querySelector('span.todo-text');
    if (!span) return;
    const currentText = span.textContent || '';

    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = currentText;
    input.setAttribute('aria-label', 'Edit todo');

    // Replace span with input
    li.replaceChild(input, span);
    input.focus();
    // Position cursor at end
    input.setSelectionRange(input.value.length, input.value.length);

    const cancel = () => {
      li.replaceChild(span, input);
    };

    const commit = () => {
      const newVal = input.value;
      if (newVal.trim() && newVal !== currentText) {
        this.editTodo(id, newVal);
      } else {
        // No change – just revert UI
        li.replaceChild(span, input);
      }
    };

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        commit();
      } else if (e.key === 'Escape') {
        cancel();
      }
    });

    // Blur also commits (optional UX)
    input.addEventListener('blur', () => {
      commit();
    });
  }
}

// --------------------------------------------------------------------
// Instantiate and initialise the app
const app = new TodoApp();
app.loadFromStorage();
app.render();

// Expose globally for debugging
window.app = app;
