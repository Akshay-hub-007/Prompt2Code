# Todo App

A simple, lightweight **Todo List** web application built with vanilla JavaScript, HTML & CSS. It demonstrates clean architecture, modular code, and client‑side persistence using `localStorage`.

---

## Tech Stack
- **HTML5** – Semantic markup.
- **CSS3** – Custom properties, responsive layout, and accessibility styling.
- **JavaScript (ES6+)** – Core application logic, DOM manipulation, and data persistence.
- **localStorage** – Saves the todo list between browser sessions.

---

## Features
- **Add** new todos via the input field or the **Enter** key.
- **Edit** an existing todo inline (Enter to save, Escape to cancel).
- **Delete** a todo.
- **Toggle completion** with a checkbox (click or space / Enter when focused).
- **Filter** view: All / Active / Completed.
- **Keyboard shortcuts**:
  - `Enter` – add todo (when focus is on the input) or commit an edit.
  - `Escape` – clear the input field or cancel an edit.
- **Live remaining count** (e.g., "3 items left").
- **Persistent storage** – todos are saved to `localStorage` and restored on page load.
- **Responsive design** – works on mobile and desktop.
- **Accessibility** – proper ARIA labels, focus outlines, and keyboard navigation.

---

## Installation & Running
1. **Clone the repository**
   ```bash
   git clone https://github.com/your‑username/todo-app.git
   cd todo-app
   ```
2. **Open the app**
   Open `src/index.html` in any modern browser (no build step required).

That's it – the app runs entirely client‑side.

---

## Usage Guide
### Adding a Todo
- Type a task into the **"What needs to be done?"** input.
- Press **Enter** or click the **Add** button.
- The new item appears in the list.

### Editing a Todo
- Click the **Edit** button next to a todo.
- The text becomes an input field.
- Modify the text and:
  - Press **Enter** to save.
  - Press **Escape** to cancel.
  - Clicking outside (blur) also saves.

### Deleting a Todo
- Click the **Delete** button next to the desired item.

### Completing a Todo
- Click the checkbox or focus it and press **Space/Enter**.
- Completed items are shown with a strike‑through and dimmed colour.

### Filtering
- Click **All**, **Active**, or **Completed** in the footer to change the view.
- The active filter button is highlighted.

### Keyboard Shortcuts
| Key | Context | Action |
|-----|---------|--------|
| `Enter` | Input field | Add todo |
| `Enter` | Edit input | Save edit |
| `Escape` | Input field | Clear field |
| `Escape` | Edit input | Cancel edit |

---

## Project Structure
```
src/
│   index.html      – Markup and entry point.
│   style.css       – All visual styling.
│   script.js       – Core application logic.
│
└───README.md       – Documentation (this file).
```
- **`script.js`** contains the **`TodoApp`** class, which manages the todo array, UI rendering, event handling, and persistence.
- The **`Todo`** model class lives in the same file and provides a simple data structure with a static `generateId()` helper.
- All DOM interactions are encapsulated inside `TodoApp`; the global `app` variable is only exposed for debugging.

---

## Persistence & Data Reset
- Todos are stored under the key **`todos`** in `localStorage` as a JSON string.
- To **clear all data**, open the browser’s developer console and run:
  ```js
  localStorage.removeItem('todos');
  location.reload();
  ```
  or manually clear site data via the browser settings.

---

## Contributing (optional)
Contributions are welcome! Feel free to:
- Open an issue to report bugs or suggest enhancements.
- Submit a pull request with clean, well‑documented code.
- Follow the existing coding style (ES6 classes, JSDoc comments, and descriptive variable names).

---

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.
