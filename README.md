# JavaScript Task Management Application

A modern, responsive, and accessible browser-based task management web application built strictly with **pure HTML5, CSS3, and Vanilla JavaScript**. Designed and engineered as part of the **AUREX Full-Stack Engineering Internship (Month 1, Week 4)**.

---

## Intern Information

* **Full Name:** Sahrish Yaseen
* **Domain:** Full-Stack Web Development
* **Internship:** AUREX Full-Stack Engineering Internship
* **Month:** 1 — Frontend Foundation
* **Week:** 4 — JavaScript Fundamentals, DOM Manipulation, Events & Data Persistence (localStorage)

---

## Project Links

* **Live Deployment Link:** `YOUR-LIVE-DEPLOYMENT-LINK` *(Deployable to GitHub Pages / Vercel)*
* **GitHub Repository:** [https://github.com/Sahrish351/aurex-week4-task-manager](https://github.com/Sahrish351/aurex-week4-task-manager)

---

## Project Overview

The objective of this Week 4 project is to solidify core JavaScript programming concepts before moving on to frontend component frameworks. The application demonstrates real-world DOM manipulation, asynchronous-feeling reactive UI rendering, event delegation, client-side input validation, and browser `localStorage` synchronization without using any external libraries or frameworks (no React, jQuery, Bootstrap, or Tailwind CSS).

---

## Technologies Used

* **HTML5:** Semantic document outline (`<header>`, `<main>`, `<section>`, `<form>`, `<ul>`, `<li>`, `<footer>`, ARIA accessibility attributes, screen-reader helper labels).
* **CSS3:** Custom properties (design tokens), Flexbox, CSS Grid, custom interactive form controls, status badges, animations (`@keyframes shake`, pulse), responsive media queries.
* **Vanilla JavaScript (ES6+):** Modern JavaScript programming standards without runtime dependencies.
* **DOM (Document Object Model):** Dynamic node selection (`getElementById`, `querySelector`, `querySelectorAll`), dynamic node creation (`document.createElement`), element removal, attribute and class list manipulation (`classList.add`, `classList.remove`, `classList.toggle`).
* **Browser localStorage API:** Local data persistence across browser sessions and reloads using `localStorage.getItem()` and `localStorage.setItem()`.
* **JSON Serialization:** `JSON.stringify()` for persisting structured JavaScript arrays of objects, and `JSON.parse()` with defensive `try...catch` error handling for data retrieval.

---

## Features Implemented

1. **Add Task:**
   * Enter a new task item with unique identification, creation timestamp, and completion status.
   * Instant DOM insertion and metric counter increment.
2. **Edit Task:**
   * In-place inline edit mode activated via the "Edit" button.
   * Auto-focused input prefilled with existing title.
   * Keyboard shortcuts supported (press <kbd>Enter</kbd> to save, <kbd>Escape</kbd> to cancel).
   * Changes immediately updated in memory and localStorage.
3. **Delete Task:**
   * Instant removal of specific tasks via the "Delete" action button.
   * Automatic removal from stored array without requiring a page reload.
4. **Mark Task as Complete / Incomplete:**
   * Interactive circular toggle button.
   * Completed tasks feature visual strikethrough, subtle opacity, green status indicator, and disabled edit action.
   * State changes update both active and completed counters and persist to localStorage.
5. **Dynamic Task Filtering:**
   * **All:** Displays all tasks in the list.
   * **Active:** Displays only uncompleted tasks.
   * **Completed:** Displays only finished tasks.
   * Filter tabs display real-time counters and highlight the current active view without page reloading.
6. **Batch Action (Clear Completed):**
   * Dedicated action to purge all completed items at once, auto-disabled when no completed items exist.
7. **Form & Input Validation:**
   * Empty input rejection.
   * Whitespace-only string rejection (`trim()` validation).
   * Minimum (2 characters) and maximum (150 characters) constraints.
   * Animated error banner and red input border on invalid attempts.
   * Automatic error clearance when the user starts typing.
8. **Data Persistence (`localStorage`):**
   * Saves task array on every create, edit, toggle, and delete action.
   * Automatically retrieves and reconstructs tasks on page load or refresh.
9. **Responsive Design:**
   * Fluid layout tested for Mobile (<640px), Tablet (640px–1024px), and Desktop (>1024px) screens.
10. **Context-Aware Empty States:**
    * Displays friendly illustrated guidance when no tasks exist, or when a filtered view (Active/Completed) has no matching items.

---

## Folder Structure

The project strictly follows the required Week 4 folder and file hierarchy:

```text
aurex-week4-task-manager/
│
├── index.html          # Semantic HTML5 layout and accessibility structure
│
├── styles/
│   └── main.css        # Responsive CSS3 styling, variables, and animations
│
├── scripts/
│   └── main.js         # Core JavaScript logic, DOM manipulation, events, & localStorage
│
└── README.md           # Complete project documentation and verification matrix
```

---

## Project Workflow

The application operates through a predictable, unidirectional data synchronization workflow:

```text
[ User Input in Form ]
          │
          ▼
[ Form Submit Event (event.preventDefault()) ]
          │
          ▼
[ Validation: Empty / Whitespace Check ]
    ├── Invalid ──► [ Display Error Alert + Shake Animation ]
    └── Valid   ──► [ Sanitize Input & Clear Error ]
                            │
                            ▼
               [ Create Task Object { id, title, completed, createdAt } ]
                            │
                            ▼
               [ Push to State Array (`tasks.push(newTask)`) ]
                            │
                            ▼
               [ Save to localStorage (`JSON.stringify`) ]
                            │
                            ▼
               [ Re-render UI (Clear old DOM nodes, calculate stats, render filtered cards) ]
                            │
                            ▼
[ User Interaction (Toggle / Inline Edit / Delete / Filter / Clear) ]
          │
          ▼
[ Update In-Memory State ──► Sync localStorage ──► Update DOM View ]
```

---

## JavaScript Fundamentals Demonstrated

During this project, core Week 4 JavaScript language concepts were practically applied:

1. **Variables (`let` & `const`):**
   * Used `const` for immutable DOM references, keys, and arrow functions.
   * Used `let` for mutable state variables (`tasks`, `currentFilter`, `currentlyEditingId`, loop counters).
2. **Data Types & Operators:**
   * Strings, Numbers, Booleans, Objects, and Arrays.
   * Strict equality (`===`, `!==`), logical AND (`&&`), logical OR (`||`), and logical NOT (`!`).
3. **Conditional Logic:**
   * `if`, `else if`, `else` branches in filter routines, validation checks, and event delegation.
4. **Loops:**
   * `for` loop utilized in `calculateTaskCounts()` to iterate and aggregate metrics.
   * `while` loop utilized in `renderApp()` (`while (taskList.firstChild) taskList.removeChild(...)`) for clean and performant DOM element cleanup before re-rendering.
5. **Functions:**
   * Function declarations, arrow functions (`() => {}`), default parameters, explicit return values.
6. **Array Methods:**
   * `.filter()` for tab filtering and purging completed tasks.
   * `.find()` to locate tasks by ID for editing or status toggles.
   * `.findIndex()` and `.splice()` for task deletion.
   * `.some()` for determining whether completed tasks exist to toggle button states.
   * `.forEach()` for attaching event listeners and iterating DOM elements.
7. **Objects & ES6+ Features:**
   * Structured task objects with metadata.
   * Object destructuring (`const { id, title, completed, createdAt } = task;`).
   * Template literals for dynamic HTML string composition.

---

## Testing & Verification Matrix

The following test suite was manually executed and verified in the browser environment:

| Feature / Scenario | Test Case Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **Add Task** | Enter valid task title & click "Add Task" or press <kbd>Enter</kbd> | Task is added to list, stats increment, input resets | **PASSED** |
| **Empty Input** | Submit form with empty string `""` | Blocked: Red warning banner and focus preserved | **PASSED** |
| **Whitespace Input** | Submit form with spaces `"   "` | Blocked: Reject whitespace-only input | **PASSED** |
| **Input Reset** | Start typing after a validation error | Error alert hidden and input error style removed | **PASSED** |
| **Complete Task** | Click checkbox button on task card | Line-through applied, badge updates, completed count +1 | **PASSED** |
| **Edit Task (Inline)** | Click "Edit", change title, click "Save" | New title persisted, edit mode closed | **PASSED** |
| **Edit Task (Keyboard)** | Press <kbd>Enter</kbd> in edit input | Saves changes immediately | **PASSED** |
| **Edit Task (Cancel)** | Press <kbd>Escape</kbd> or click "Cancel" | Reverts to view mode without changing original title | **PASSED** |
| **Delete Task** | Click "Delete" on a task card | Task removed from DOM, metrics updated | **PASSED** |
| **Filter: Active** | Click "Active" tab | Shows only uncompleted tasks; hides completed | **PASSED** |
| **Filter: Completed** | Click "Completed" tab | Shows only completed tasks; hides active | **PASSED** |
| **Filter: All** | Click "All" tab | Displays all tasks in the list | **PASSED** |
| **Clear Completed** | Click "Clear Completed" button | All completed tasks purged; button auto-disables | **PASSED** |
| **localStorage Save** | Add, edit, or toggle tasks | Serialized JSON stored in `localStorage` under key | **PASSED** |
| **Page Refresh** | Refresh page with existing tasks | All tasks, statuses, and counts reload accurately | **PASSED** |
| **Responsive Layout** | View on mobile (375px), tablet (768px), and desktop | Clean layout, readable text, touch-friendly buttons | **PASSED** |

---

## Challenges Faced & What Was Learned

1. **State Synchronization Between DOM and `localStorage`:**
   * *Challenge:* Keeping the rendered DOM elements strictly in sync with the array state in `localStorage` without generating stale or duplicated entries.
   * *Solution:* Implemented a single source of truth (`tasks` array). Whenever an action occurs (add, toggle, edit, delete), the array is updated first, written to `localStorage` via `JSON.stringify()`, and then `renderApp()` cleanly redraws the list based on the current filter.
2. **Handling Inline Editing without Complex Frameworks:**
   * *Challenge:* Managing inline editing state in vanilla JavaScript while preventing conflicts between editing multiple tasks simultaneously.
   * *Solution:* Maintained a `currentlyEditingId` state variable. When an item enters edit mode, only that specific item re-renders with an edit input and Save/Cancel controls, with keyboard event handlers attached for optimal UX (<kbd>Enter</kbd> to save, <kbd>Escape</kbd> to cancel).
3. **Robust Input Validation & Edge Cases:**
   * *Challenge:* Preventing accidental creation of blank tasks or tasks with only whitespace characters.
   * *Solution:* Created a dedicated `validateTaskTitle` function using `String.prototype.trim()` and length validation, returning structured `{ isValid, error, sanitizedTitle }` result objects.
4. **Preventing DOM Accumulation:**
   * *Challenge:* Ensuring that re-rendering filtered lists did not leak memory or leave orphaned event listeners.
   * *Solution:* Used event delegation on `#task-list` so listeners are attached once to the parent container, while child items are efficiently cleared using a fast `while (taskList.firstChild) taskList.removeChild(...)` loop.

---

## How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/Sahrish351/aurex-week4-task-manager.git
   ```
2. Navigate into the project directory:
   ```bash
   cd aurex-week4-task-manager
   ```
3. Open `index.html` in your web browser:
   * Double-click `index.html` directly, or
   * Use VS Code's "Live Server" extension, or
   * Run a local HTTP server:
     ```bash
     npx serve .
     ```

---

## License & Attribution

This project was built for academic and professional assessment within the **AUREX Full-Stack Engineering Internship Program**. All code is open-source and free for educational use.
