import './styles.css';

const app = require('./app');
const dom = require('./dom');

// --- Dialog elements ------------------------------------------------------

const todoDialog = document.getElementById('todo-dialog');
const todoForm = document.getElementById('todo-form');
const todoFormTitle = document.getElementById('todo-form-title');
const todoIdInput = document.getElementById('todo-id-input');
const todoCancelBtn = document.getElementById('todo-cancel-btn');

const projectDialog = document.getElementById('project-dialog');
const projectForm = document.getElementById('project-form');
const projectCancelBtn = document.getElementById('project-cancel-btn');

const newProjectBtn = document.getElementById('new-project-btn');
const newTodoBtn = document.getElementById('new-todo-btn');

// --- Render orchestration ---------------------------------------------

function renderAll() {
  const projects = app.getProjects();
  const active = app.getActiveProject();

  dom.renderProjects(projects, active ? active.id : null, {
    onSelect: (projectId) => {
      app.setActiveProject(projectId);
      renderAll();
    },
    onDelete: (projectId) => {
      app.deleteProject(projectId);
      renderAll();
    },
  });

  dom.renderTodos(active, {
    onToggleComplete: (todoId) => {
      app.toggleTodoComplete(active.id, todoId);
      renderAll();
    },
    onDelete: (todoId) => {
      app.deleteTodo(active.id, todoId);
      renderAll();
    },
    onEdit: (todoId) => openTodoDialogForEdit(active.id, todoId),
  });
}

// --- Todo dialog handling -----------------------------------------------

function openTodoDialogForCreate() {
  todoForm.reset();
  todoIdInput.value = '';
  todoFormTitle.textContent = 'New Todo';
  todoDialog.showModal();
}

function openTodoDialogForEdit(projectId, todoId) {
  const project = app.getProjects().find((p) => p.id === projectId);
  const todo = project.todos.find((t) => t.id === todoId);
  if (!todo) return;

  todoForm.title.value = todo.title;
  todoForm.description.value = todo.description;
  todoForm.dueDate.value = todo.dueDate;
  todoForm.priority.value = todo.priority;
  todoForm.notes.value = todo.notes;
  todoIdInput.value = todo.id;
  todoFormTitle.textContent = 'Edit Todo';
  todoDialog.showModal();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const active = app.getActiveProject();
  if (!active) return;

  const data = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    priority: todoForm.priority.value,
    notes: todoForm.notes.value,
  };

  if (todoIdInput.value) {
    app.editTodo(active.id, todoIdInput.value, data);
  } else {
    app.createNewTodo(active.id, data);
  }

  todoDialog.close();
  renderAll();
});

todoCancelBtn.addEventListener('click', () => {
  todoDialog.close();
});

newTodoBtn.addEventListener('click', () => openTodoDialogForCreate());

// --- Project dialog handling ----------------------------------------------

newProjectBtn.addEventListener('click', () => {
  projectForm.reset();
  projectDialog.showModal();
});

projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = projectForm.name.value;
  const project = app.createNewProject(name);
  if (project) app.setActiveProject(project.id);
  projectDialog.close();
  renderAll();
});

projectCancelBtn.addEventListener('click', () => {
  projectDialog.close();
});

// --- Boot -----------------------------------------------------------------

app.init();
renderAll();