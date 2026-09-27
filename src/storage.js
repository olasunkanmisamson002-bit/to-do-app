// storage.js
// Everything localStorage-related lives here, isolated, so the rest of the
// app doesn't need to know or care HOW persistence works. If you swapped
// localStorage for a backend API later, this is the only file you'd touch.

const STORAGE_KEY = 'todo-app-projects';

function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (err) {
    // localStorage can throw (private browsing, quota exceeded, disabled).
    // Don't let a save failure crash the app.
    console.error('Could not save to localStorage:', err);
    return false;
  }
}

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null; // nothing saved yet — caller should fall back to defaults
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (err) {
    console.error('Could not load from localStorage:', err);
    return null;
  }
}

module.exports = { saveProjects, loadProjects };