// todo.js
// Responsible ONLY for creating and mutating a single todo object.
// No DOM code lives here — that separation is the whole point of the assignment.

let idCounter = 0;

function nextId() {
  idCounter += 1;
  return `todo-${Date.now()}-${idCounter}`;
}

// Factory function — returns a plain object rather than a class instance,
// which matters later: plain objects survive JSON.stringify/parse round-trips
// cleanly, whereas class instances would lose their prototype methods.
function createTodo({
  title,
  description = '',
  dueDate,
  priority = 'medium',
  notes = '',
}) {
  return {
    id: nextId(),
    title,
    description,
    dueDate, // stored as an ISO date string, e.g. "2026-10-05"
    priority, // 'low' | 'medium' | 'high'
    notes,
    complete: false,
  };
}

function toggleComplete(todo) {
  todo.complete = !todo.complete;
  return todo;
}

function updateTodo(todo, updates) {
  Object.assign(todo, updates);
  return todo;
}

// After loading todos back from localStorage, idCounter resets to 0 on page
// reload, which risks id collisions with freshly-created todos in the same
// session. Call this once at startup with the highest counter value seen.
function seedIdCounter(loadedTodos) {
  const maxSeen = loadedTodos.reduce((max, t) => {
    const match = /todo-\d+-(\d+)$/.exec(t.id);
    const n = match ? Number(match[1]) : 0;
    return Math.max(max, n);
  }, 0);
  idCounter = Math.max(idCounter, maxSeen);
}

module.exports = { createTodo, toggleComplete, updateTodo, seedIdCounter };