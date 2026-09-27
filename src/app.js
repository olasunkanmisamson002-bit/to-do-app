// app.js
// The application "brain": owns in-memory state (the list of projects and
// which one is currently selected) and exposes functions to mutate that
// state. This module knows nothing about the DOM — dom.js is the only file
// allowed to touch document/querySelector/etc.

const { createProject, addTodo, removeTodo, findTodo, seedIdCounter: seedProjectIds } = require('./project');
const { createTodo, toggleComplete, updateTodo, seedIdCounter: seedTodoIds } = require('./todo');
const { saveProjects, loadProjects } = require('./storage');

const DEFAULT_PROJECT_NAME = 'Default';

const state = {
  projects: [],
  activeProjectId: null,
};

function persist() {
  saveProjects(state.projects);
}

// Call once when the app boots. Loads saved data if present, otherwise
// creates a starting "Default" project so the app is never empty.
function init() {
  const loaded = loadProjects();

  if (loaded && loaded.length > 0) {
    state.projects = loaded;
    // Reseed both id counters so new items created this session never
    // collide with ids that came back from storage.
    seedProjectIds(loaded);
    const allTodos = loaded.flatMap((p) => p.todos);
    seedTodoIds(allTodos);
  } else {
    const defaultProject = createProject(DEFAULT_PROJECT_NAME);
    state.projects = [defaultProject];
  }

  state.activeProjectId = state.projects[0].id;
  persist();
}

function getProjects() {
  return state.projects;
}

function getActiveProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || null;
}

function setActiveProject(projectId) {
  state.activeProjectId = projectId;
}

function createNewProject(name) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const project = createProject(trimmed);
  state.projects.push(project);
  persist();
  return project;
}

function deleteProject(projectId) {
  if (state.projects.length <= 1) {
    // Never allow deleting the last remaining project — the app needs
    // somewhere for new todos to go.
    return false;
  }
  state.projects = state.projects.filter((p) => p.id !== projectId);
  if (state.activeProjectId === projectId) {
    state.activeProjectId = state.projects[0].id;
  }
  persist();
  return true;
}

function createNewTodo(projectId, todoData) {
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const todo = createTodo(todoData);
  addTodo(project, todo);
  persist();
  return todo;
}

function editTodo(projectId, todoId, updates) {
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const todo = findTodo(project, todoId);
  if (!todo) return null;
  updateTodo(todo, updates);
  persist();
  return todo;
}

function deleteTodo(projectId, todoId) {
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return false;
  removeTodo(project, todoId);
  persist();
  return true;
}

function toggleTodoComplete(projectId, todoId) {
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const todo = findTodo(project, todoId);
  if (!todo) return null;
  toggleComplete(todo);
  persist();
  return todo;
}

module.exports = {
  init,
  getProjects,
  getActiveProject,
  setActiveProject,
  createNewProject,
  deleteProject,
  createNewTodo,
  editTodo,
  deleteTodo,
  toggleTodoComplete,
};