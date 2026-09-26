/**
 * ==============================================================================
 * AUREX Full-Stack Engineering Internship — Month 1, Week 4
 * Task Management Application
 * 
 * Primary Concepts Demonstrated:
 * - JavaScript Fundamentals (let/const, types, conditions, loops, functions)
 * - Array Methods (filter, find, findIndex, some, forEach)
 * - Object Manipulation & ES6+ Destructuring
 * - DOM Manipulation (getElementById, querySelector, querySelectorAll, createElement)
 * - Event Handling (submit, click, input, keydown)
 * - Input Validation & Error Feedback
 * - Persistent Data Storage via browser localStorage (JSON.stringify, JSON.parse)
 * 
 * Author: Sahrish Yaseen
 * ==============================================================================
 */

// Strict mode for cleaner and safer JavaScript execution
'use strict';

/* --------------------------------------------------------------------------
   1. CONSTANTS & APPLICATION STATE
   -------------------------------------------------------------------------- */
const STORAGE_KEY = 'aurex_task_manager_tasks';

// Application state object
let tasks = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'
let currentlyEditingId = null;

/* --------------------------------------------------------------------------
   2. DOM ELEMENT REFERENCES
   Demonstrating: getElementById, querySelector, and querySelectorAll
   -------------------------------------------------------------------------- */
// Form & Input elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const validationMessage = document.getElementById('validation-message');
const validationText = document.getElementById('validation-text');

// Task List & Empty State elements
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyDescription = document.getElementById('empty-description');

// Filter & Control elements
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Summary & Counter elements
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statCompleted = document.getElementById('stat-completed');
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');
const currentDateEl = document.getElementById('current-date');

/* --------------------------------------------------------------------------
   3. STORAGE OPERATIONS (localStorage)
   Demonstrating: localStorage, JSON.stringify, JSON.parse, try/catch
   -------------------------------------------------------------------------- */

/**
 * Loads tasks from browser localStorage.
 * Returns an array of tasks or an empty array if none exist or if parsing fails.
 * @returns {Array<Object>}
 */
function loadTasksFromStorage() {
  try {
    const serializedTasks = localStorage.getItem(STORAGE_KEY);
    if (serializedTasks !== null) {
      const parsedTasks = JSON.parse(serializedTasks);
      // Ensure the parsed item is indeed an array
      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    }
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
  }
  return [];
}

/**
 * Saves current task array to browser localStorage.
 * Demonstrates JSON.stringify.
 * @param {Array<Object>} taskArray 
 */
function saveTasksToStorage(taskArray) {
  try {
    const serializedTasks = JSON.stringify(taskArray);
    localStorage.setItem(STORAGE_KEY, serializedTasks);
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

/* --------------------------------------------------------------------------
   4. DATA PROCESSING & UTILITY FUNCTIONS
   Demonstrating: Functions, loops (for & while), conditionals, arrays, objects
   -------------------------------------------------------------------------- */

/**
 * Formats a timestamp into a human-readable date/time string.
 * Demonstrates template literals.
 * @param {number} timestamp 
 * @returns {string}
 */
const formatTaskDate = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${day} at ${hours}:${minutes}`;
};

/**
 * Generates a unique task identifier.
 * @returns {string}
 */
const generateUniqueId = () => {
  return `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

/**
 * Calculates current counts using a standard `for` loop.
 * Demonstrates: loops (for), conditionals (if / else), arithmetic operators.
 * @returns {Object} { total, active, completed }
 */
function calculateTaskCounts() {
  let activeCount = 0;
  let completedCount = 0;

  // Demonstrating standard for loop
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.completed === true) {
      completedCount++;
    } else {
      activeCount++;
    }
  }

  return {
    total: tasks.length,
    active: activeCount,
    completed: completedCount
  };
}

/**
 * Filters task list based on the active filter state.
 * Demonstrates: Array.prototype.filter, comparison operators.
 * @param {string} filterType 
 * @returns {Array<Object>}
 */
function getFilteredTasks(filterType) {
  if (filterType === 'active') {
    return tasks.filter((task) => !task.completed);
  } else if (filterType === 'completed') {
    return tasks.filter((task) => task.completed);
  } else {
    return tasks; // 'all' filter
  }
}

/* --------------------------------------------------------------------------
   5. VALIDATION & FEEDBACK
   Demonstrating: Form validation, DOM updates, class toggling
   -------------------------------------------------------------------------- */

/**
 * Displays a validation error message and highlights the input.
 * @param {string} message 
 */
function showValidationError(message) {
  validationText.textContent = message;
  validationMessage.classList.remove('hidden');
  taskInput.classList.add('input-error');
  taskInput.focus();
}

/**
 * Clears any active validation error message.
 */
function clearValidationError() {
  validationMessage.classList.add('hidden');
  taskInput.classList.remove('input-error');
}

/**
 * Validates a task title string.
 * Demonstrates: Logical operators, string manipulation, conditionals.
 * @param {string} rawTitle 
 * @returns {Object} { isValid: boolean, error?: string, sanitizedTitle?: string }
 */
function validateTaskTitle(rawTitle) {
  if (typeof rawTitle !== 'string') {
    return { isValid: false, error: 'Invalid input type.' };
  }

  const trimmed = rawTitle.trim();

  // Rule 1: Disallow completely empty input
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Task title cannot be empty or whitespace only.' };
  }

  // Rule 2: Minimum character length
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Task title must be at least 2 characters long.' };
  }

  // Rule 3: Maximum character length
  if (trimmed.length > 150) {
    return { isValid: false, error: 'Task title cannot exceed 150 characters.' };
  }

  return { isValid: true, sanitizedTitle: trimmed };
}

/* --------------------------------------------------------------------------
   6. TASK CRUD OPERATIONS
   Demonstrating: Object creation, array manipulation, localStorage updates
   -------------------------------------------------------------------------- */

/**
 * Creates a new task object and saves it.
 * Demonstrates: Object literal, properties, push, save.
 * @param {string} title 
 */
function addTask(title) {
  const newTask = {
    id: generateUniqueId(),
    title: title,
    completed: false,
    createdAt: Date.now()
  };

  tasks.push(newTask);
  saveTasksToStorage(tasks);
  renderApp();
}

/**
 * Toggles a task's completion status by its unique ID.
 * Demonstrates: Array.prototype.find, logical NOT operator.
 * @param {string} taskId 
 */
function toggleTaskCompletion(taskId) {
  const targetTask = tasks.find((t) => t.id === taskId);
  if (targetTask) {
    targetTask.completed = !targetTask.completed;
    saveTasksToStorage(tasks);
    renderApp();
  }
}

/**
 * Deletes a task from the list by its unique ID.
 * Demonstrates: Array.prototype.findIndex, Array.prototype.splice.
 * @param {string} taskId 
 */
function deleteTask(taskId) {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    // If currently editing this task, exit edit mode
    if (currentlyEditingId === taskId) {
      currentlyEditingId = null;
    }
    saveTasksToStorage(tasks);
    renderApp();
  }
}

/**
 * Updates an existing task's title.
 * @param {string} taskId 
 * @param {string} newTitle 
 */
function updateTaskTitle(taskId, newTitle) {
  const targetTask = tasks.find((t) => t.id === taskId);
  if (targetTask) {
    targetTask.title = newTitle;
    currentlyEditingId = null;
    saveTasksToStorage(tasks);
    renderApp();
  }
}

/**
 * Clears all completed tasks from storage and state.
 * Demonstrates: Array.prototype.filter, saveTasksToStorage.
 */
function clearAllCompletedTasks() {
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => !t.completed);
  
  if (tasks.length !== initialLength) {
    saveTasksToStorage(tasks);
    renderApp();
  }
}

/* --------------------------------------------------------------------------
   7. UI RENDERING & DOM MANIPULATION
   Demonstrating:
   - Dynamic element creation (document.createElement)
   - while loop for clearing children
   - Object destructuring
   - Template literals
   - classList operations
   -------------------------------------------------------------------------- */

/**
 * Creates the DOM element for a single task item.
 * Demonstrates: Destructuring, createElement, innerHTML, event attachment.
 * @param {Object} task 
 * @returns {HTMLElement}
 */
function createTaskElement(task) {
  // ES6 Destructuring
  const { id, title, completed, createdAt } = task;
  const isEditing = (currentlyEditingId === id);

  const li = document.createElement('li');
  li.className = `task-item ${completed ? 'completed' : ''} ${isEditing ? 'is-editing' : ''}`;
  li.dataset.id = id;

  if (isEditing) {
    // Render inline edit form
    li.innerHTML = `
      <div class="edit-form-wrapper">
        <input 
          type="text" 
          class="edit-input" 
          value="${escapeHtml(title)}" 
          aria-label="Edit task title"
          maxlength="150"
        />
        <button type="button" class="btn btn-save" title="Save changes">Save</button>
        <button type="button" class="btn btn-cancel" title="Cancel edit">Cancel</button>
      </div>
    `;

    // Focus input and place cursor at end
    const editInput = li.querySelector('.edit-input');
    if (editInput) {
      setTimeout(() => {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
      }, 0);
    }
  } else {
    // Render standard task item
    const formattedDate = formatTaskDate(createdAt);
    const statusLabel = completed ? 'Completed' : 'Active';

    li.innerHTML = `
      <div class="task-content">
        <button 
          type="button" 
          class="task-checkbox-btn" 
          aria-label="Mark task as ${completed ? 'active' : 'completed'}" 
          title="Toggle completion"
        >
          ${completed ? '✓' : ''}
        </button>
        <div class="task-details">
          <span class="task-text">${escapeHtml(title)}</span>
          <div class="task-meta">
            <span class="task-badge">${statusLabel}</span>
            <span>Created ${formattedDate}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button 
          type="button" 
          class="action-btn btn-edit" 
          title="Edit this task"
          ${completed ? 'disabled' : ''}
        >
          ✎ Edit
        </button>
        <button 
          type="button" 
          class="action-btn btn-delete" 
          title="Delete this task"
        >
          ✕ Delete
        </button>
      </div>
    `;
  }

  return li;
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Updates UI stats and filter counts.
 */
function updateSummaryStats() {
  const counts = calculateTaskCounts();

  // Update header metric cards
  statTotal.textContent = counts.total;
  statActive.textContent = counts.active;
  statCompleted.textContent = counts.completed;

  // Update filter badge counts
  countAll.textContent = counts.total;
  countActive.textContent = counts.active;
  countCompleted.textContent = counts.completed;

  // Update 'Clear Completed' button disabled state
  // Demonstrates: Array.prototype.some
  const hasCompleted = tasks.some((task) => task.completed);
  clearCompletedBtn.disabled = !hasCompleted;
}

/**
 * Updates empty state message based on current filter.
 * @param {number} filteredCount 
 */
function updateEmptyState(filteredCount) {
  if (filteredCount === 0) {
    emptyState.classList.remove('hidden');

    if (tasks.length === 0) {
      emptyTitle.textContent = 'No tasks yet';
      emptyDescription.textContent = 'Add your first task above to start organizing your day!';
    } else if (currentFilter === 'active') {
      emptyTitle.textContent = 'No active tasks';
      emptyDescription.textContent = 'All caught up! All your tasks are completed.';
    } else if (currentFilter === 'completed') {
      emptyTitle.textContent = 'No completed tasks';
      emptyDescription.textContent = 'Complete some tasks to see them listed here.';
    }
  } else {
    emptyState.classList.add('hidden');
  }
}

/**
 * Main application render function.
 * Cleans and rebuilds the task list in the DOM.
 * Demonstrates: while loop, createElement, appendChild, classList.
 */
function renderApp() {
  // Update overview metrics
  updateSummaryStats();

  // Demonstrating a while loop to cleanly remove all existing task elements
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  // Get tasks matching active filter
  const filteredTasks = getFilteredTasks(currentFilter);

  // Update empty state banner
  updateEmptyState(filteredTasks.length);

  // Render each task element
  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
}

/* --------------------------------------------------------------------------
   8. EVENT LISTENERS & HANDLERS
   Demonstrating:
   - Form submission with event.preventDefault()
   - click events & event delegation
   - input event for live validation reset
   - keyboard interactions (Enter / Escape)
   -------------------------------------------------------------------------- */

/**
 * Handles Task Form submission.
 * @param {Event} event 
 */
function handleTaskFormSubmit(event) {
  event.preventDefault(); // Prevents default page reload

  const rawValue = taskInput.value;
  const validation = validateTaskTitle(rawValue);

  if (!validation.isValid) {
    showValidationError(validation.error);
    return;
  }

  // Clear errors and input
  clearValidationError();
  addTask(validation.sanitizedTitle);
  taskInput.value = '';
  taskInput.focus();
}

/**
 * Handles clicks within the Task List container using Event Delegation.
 * @param {MouseEvent} event 
 */
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest('.task-item');
  if (!taskItem) return;

  const taskId = taskItem.dataset.id;

  // Case 1: Checkbox / Completion Toggle
  if (target.closest('.task-checkbox-btn')) {
    toggleTaskCompletion(taskId);
    return;
  }

  // Case 2: Edit Button Click
  if (target.closest('.btn-edit')) {
    currentlyEditingId = taskId;
    renderApp();
    return;
  }

  // Case 3: Delete Button Click
  if (target.closest('.btn-delete')) {
    deleteTask(taskId);
    return;
  }

  // Case 4: Save Edit Button Click
  if (target.closest('.btn-save')) {
    const editInput = taskItem.querySelector('.edit-input');
    if (editInput) {
      commitTaskEdit(taskId, editInput.value);
    }
    return;
  }

  // Case 5: Cancel Edit Button Click
  if (target.closest('.btn-cancel')) {
    currentlyEditingId = null;
    renderApp();
    return;
  }
}

/**
 * Commits an inline task title edit with validation.
 * @param {string} taskId 
 * @param {string} newTitle 
 */
function commitTaskEdit(taskId, newTitle) {
  const validation = validateTaskTitle(newTitle);
  if (!validation.isValid) {
    alert(validation.error); // Immediate feedback for inline edit
    return;
  }
  updateTaskTitle(taskId, validation.sanitizedTitle);
}

/**
 * Handles keyboard shortcuts within the task list (e.g. while editing).
 * @param {KeyboardEvent} event 
 */
function handleTaskListKeydown(event) {
  const target = event.target;
  if (target.classList.contains('edit-input')) {
    const taskItem = target.closest('.task-item');
    const taskId = taskItem.dataset.id;

    if (event.key === 'Enter') {
      event.preventDefault();
      commitTaskEdit(taskId, target.value);
    } else if (event.key === 'Escape') {
      currentlyEditingId = null;
      renderApp();
    }
  }
}

/**
 * Handles filter tab button clicks.
 * Demonstrates: querySelectorAll, forEach, dataset, classList.
 * @param {Event} event 
 */
function handleFilterClick(event) {
  const clickedBtn = event.currentTarget;
  const selectedFilter = clickedBtn.dataset.filter;

  if (selectedFilter === currentFilter) return;

  currentFilter = selectedFilter;

  // Update tab visual states
  filterButtons.forEach((btn) => {
    const isActive = (btn === clickedBtn);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  renderApp();
}

/**
 * Formats and sets today's date in header.
 */
function renderHeaderDate() {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);
  currentDateEl.textContent = today;
}

/* --------------------------------------------------------------------------
   9. INITIALIZATION
   -------------------------------------------------------------------------- */
function init() {
  // Render current date
  renderHeaderDate();

  // Load existing tasks from browser localStorage
  tasks = loadTasksFromStorage();

  // Bind Form Events
  taskForm.addEventListener('submit', handleTaskFormSubmit);

  // Live input validation listener: clear errors on typing
  taskInput.addEventListener('input', () => {
    if (taskInput.value.trim().length > 0) {
      clearValidationError();
    }
  });

  // Bind Task List delegated clicks and keydown events
  taskList.addEventListener('click', handleTaskListClick);
  taskList.addEventListener('keydown', handleTaskListKeydown);

  // Bind Filter Buttons
  filterButtons.forEach((button) => {
    button.addEventListener('click', handleFilterClick);
  });

  // Bind Clear Completed Button
  clearCompletedBtn.addEventListener('click', () => {
    clearAllCompletedTasks();
  });

  // Initial UI Render
  renderApp();
}

// Kick off application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
