// dom.js
const { format, parseISO, isPast, isToday } = require('date-fns');

const projectListEl = document.getElementById('project-list');
const projectTitleEl = document.getElementById('project-title');
const projectMetaEl = document.getElementById('project-meta');
const todoListEl = document.getElementById('todo-list');

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function renderProjects(projects, activeProjectId, callbacks) {
  clearChildren(projectListEl);

  projects.forEach((project) => {
    const li = document.createElement('li');
    li.className = 'project-item';
    if (project.id === activeProjectId) li.classList.add('active');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = project.name;
    nameSpan.className = 'project-name';
    nameSpan.addEventListener('click', () => callbacks.onSelect(project.id));

    li.appendChild(nameSpan);

    if (projects.length > 1) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.className = 'project-delete-btn';
      deleteBtn.type = 'button';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onDelete(project.id);
      });
      li.appendChild(deleteBtn);
    }

    projectListEl.appendChild(li);
  });
}

function priorityClass(priority) {
  return `priority-${priority}`;
}

function priorityLabel(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return 'No due date';
  const date = parseISO(dueDateStr);
  const label = format(date, 'MMM d, yyyy');
  if (isToday(date)) return `Today · ${label}`;
  if (isPast(date)) return `Overdue · ${label}`;
  return label;
}

function renderTodos(project, callbacks) {
  projectTitleEl.textContent = project ? project.name : '';
  clearChildren(todoListEl);

  if (!project) return;

  const openCount = project.todos.filter((t) => !t.complete).length;
  const doneCount = project.todos.length - openCount;
  projectMetaEl.textContent = project.todos.length
    ? `${openCount} open, ${doneCount} done`
    : '';

  if (project.todos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No todos yet. Add one to get started.';
    todoListEl.appendChild(empty);
    return;
  }

  project.todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${priorityClass(todo.priority)}`;
    if (todo.complete) li.classList.add('complete');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.complete;
    checkbox.addEventListener('change', () => callbacks.onToggleComplete(todo.id));

    const summary = document.createElement('div');
    summary.className = 'todo-summary';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'todo-title';
    titleSpan.textContent = todo.title;

    const metaSpan = document.createElement('span');
    metaSpan.className = 'todo-meta mono';

    const priorityTag = document.createElement('span');
    priorityTag.className = 'priority-tag';
    priorityTag.textContent = priorityLabel(todo.priority);

    const dueSpan = document.createElement('span');
    dueSpan.className = 'todo-due';
    dueSpan.textContent = formatDueDate(todo.dueDate);

    metaSpan.appendChild(priorityTag);
    metaSpan.appendChild(dueSpan);

    summary.appendChild(titleSpan);
    summary.appendChild(metaSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remove';
    deleteBtn.type = 'button';
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onDelete(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(summary);
    li.appendChild(deleteBtn);

    const details = document.createElement('div');
    details.className = 'todo-details hidden';
    details.innerHTML = `
      <p><strong>Description:</strong> ${escapeHtml(todo.description) || '—'}</p>
      <p><strong>Notes:</strong> ${escapeHtml(todo.notes) || '—'}</p>
    `;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.type = 'button';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onEdit(todo.id);
    });
    details.appendChild(editBtn);

    li.appendChild(details);

    summary.addEventListener('click', () => details.classList.toggle('hidden'));

    todoListEl.appendChild(li);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

module.exports = { renderProjects, renderTodos };