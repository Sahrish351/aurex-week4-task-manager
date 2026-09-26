'use strict';

const STORAGE_KEY = 'aurex_task_manager_tasks';

let tasks = [];
let currentFilter = 'all';
let currentlyEditingId = null;

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const validationMessage = document.getElementById('validation-message');
const validationText = document.getElementById('validation-text');

const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyDescription = document.getElementById('empty-description');

const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statCompleted = document.getElementById('stat-completed');
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');
const currentDateEl = document.getElementById('current-date');

function loadTasksFromStorage() {
  try {
    const serializedTasks = localStorage.getItem(STORAGE_KEY);
    if (serializedTasks !== null) {
      const parsedTasks = JSON.parse(serializedTasks);
      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    }
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
  }
  return [];
}

function saveTasksToStorage(taskArray) {
  try {
    const serializedTasks = JSON.stringify(taskArray);
    localStorage.setItem(STORAGE_KEY, serializedTasks);
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

const formatTaskDate = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${day} at ${hours}:${minutes}`;
};

const generateUniqueId = () => {
  return `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

function calculateTaskCounts() {
  let activeCount = 0;
  let completedCount = 0;

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

function getFilteredTasks(filterType) {
  if (filterType === 'active') {
    return tasks.filter((task) => !task.completed);
  } else if (filterType === 'completed') {
    return tasks.filter((task) => task.completed);
  } else {
    return tasks;
  }
}

function showValidationError(message) {
  validationText.textContent = message;
  validationMessage.classList.remove('hidden');
  taskInput.classList.add('input-error');
  taskInput.focus();
}

function clearValidationError() {
  validationMessage.classList.add('hidden');
  taskInput.classList.remove('input-error');
}

function validateTaskTitle(rawTitle) {
  if (typeof rawTitle !== 'string') {
    return { isValid: false, error: 'Invalid input type.' };
  }

  const trimmed = rawTitle.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Task title cannot be empty or whitespace only.' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Task title must be at least 2 characters long.' };
  }

  if (trimmed.length > 150) {
    return { isValid: false, error: 'Task title cannot exceed 150 characters.' };
  }

  return { isValid: true, sanitizedTitle: trimmed };
}

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

function toggleTaskCompletion(taskId) {
  const targetTask = tasks.find((t) => t.id === taskId);
  if (targetTask) {
    targetTask.completed = !targetTask.completed;
    saveTasksToStorage(tasks);
    renderApp();
  }
}

function deleteTask(taskId) {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    if (currentlyEditingId === taskId) {
      currentlyEditingId = null;
    }
    saveTasksToStorage(tasks);
    renderApp();
  }
}

function updateTaskTitle(taskId, newTitle) {
  const targetTask = tasks.find((t) => t.id === taskId);
  if (targetTask) {
    targetTask.title = newTitle;
    currentlyEditingId = null;
    saveTasksToStorage(tasks);
    renderApp();
  }
}

function clearAllCompletedTasks() {
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => !t.completed);
  
  if (tasks.length !== initialLength) {
    saveTasksToStorage(tasks);
    renderApp();
  }
}

function createTaskElement(task) {
  const { id, title, completed, createdAt } = task;
  const isEditing = (currentlyEditingId === id);

  const li = document.createElement('li');
  li.className = `task-item ${completed ? 'completed' : ''} ${isEditing ? 'is-editing' : ''}`;
  li.dataset.id = id;

  if (isEditing) {
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

    const editInput = li.querySelector('.edit-input');
    if (editInput) {
      setTimeout(() => {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
      }, 0);
    }
  } else {
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateSummaryStats() {
  const counts = calculateTaskCounts();

  statTotal.textContent = counts.total;
  statActive.textContent = counts.active;
  statCompleted.textContent = counts.completed;

  countAll.textContent = counts.total;
  countActive.textContent = counts.active;
  countCompleted.textContent = counts.completed;

  const hasCompleted = tasks.some((task) => task.completed);
  clearCompletedBtn.disabled = !hasCompleted;
}

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

function renderApp() {
  updateSummaryStats();

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  const filteredTasks = getFilteredTasks(currentFilter);

  updateEmptyState(filteredTasks.length);

  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
}

function handleTaskFormSubmit(event) {
  event.preventDefault();

  const rawValue = taskInput.value;
  const validation = validateTaskTitle(rawValue);

  if (!validation.isValid) {
    showValidationError(validation.error);
    return;
  }

  clearValidationError();
  addTask(validation.sanitizedTitle);
  taskInput.value = '';
  taskInput.focus();
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest('.task-item');
  if (!taskItem) return;

  const taskId = taskItem.dataset.id;

  if (target.closest('.task-checkbox-btn')) {
    toggleTaskCompletion(taskId);
    return;
  }

  if (target.closest('.btn-edit')) {
    currentlyEditingId = taskId;
    renderApp();
    return;
  }

  if (target.closest('.btn-delete')) {
    deleteTask(taskId);
    return;
  }

  if (target.closest('.btn-save')) {
    const editInput = taskItem.querySelector('.edit-input');
    if (editInput) {
      commitTaskEdit(taskId, editInput.value);
    }
    return;
  }

  if (target.closest('.btn-cancel')) {
    currentlyEditingId = null;
    renderApp();
    return;
  }
}

function commitTaskEdit(taskId, newTitle) {
  const validation = validateTaskTitle(newTitle);
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }
  updateTaskTitle(taskId, validation.sanitizedTitle);
}

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

function handleFilterClick(event) {
  const clickedBtn = event.currentTarget;
  const selectedFilter = clickedBtn.dataset.filter;

  if (selectedFilter === currentFilter) return;

  currentFilter = selectedFilter;

  filterButtons.forEach((btn) => {
    const isActive = (btn === clickedBtn);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  renderApp();
}

function renderHeaderDate() {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);
  currentDateEl.textContent = today;
}

function init() {
  renderHeaderDate();
  tasks = loadTasksFromStorage();

  taskForm.addEventListener('submit', handleTaskFormSubmit);

  taskInput.addEventListener('input', () => {
    if (taskInput.value.trim().length > 0) {
      clearValidationError();
    }
  });

  taskList.addEventListener('click', handleTaskListClick);
  taskList.addEventListener('keydown', handleTaskListKeydown);

  filterButtons.forEach((button) => {
    button.addEventListener('click', handleFilterClick);
  });

  clearCompletedBtn.addEventListener('click', () => {
    clearAllCompletedTasks();
  });

  renderApp();
}

document.addEventListener('DOMContentLoaded', init);
