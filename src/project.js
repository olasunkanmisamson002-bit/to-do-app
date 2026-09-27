// project.js
// A project is just a named container of todos. Again: no DOM code here.

let idCounter = 0;

function nextId() {
  idCounter += 1;
  return `project-${Date.now()}-${idCounter}`;
}

function createProject(name) {
  return {
    id: nextId(),
    name,
    todos: [],
  };
}

function addTodo(project, todo) {
  project.todos.push(todo);
  return project;
}

function removeTodo(project, todoId) {
  project.todos = project.todos.filter((t) => t.id !== todoId);
  return project;
}

function findTodo(project, todoId) {
  return project.todos.find((t) => t.id === todoId);
}

function seedIdCounter(loadedProjects) {
  const maxSeen = loadedProjects.reduce((max, p) => {
    const match = /project-\d+-(\d+)$/.exec(p.id);
    const n = match ? Number(match[1]) : 0;
    return Math.max(max, n);
  }, 0);
  idCounter = Math.max(idCounter, maxSeen);
}

module.exports = {
  createProject,
  addTodo,
  removeTodo,
  findTodo,
  seedIdCounter,
};