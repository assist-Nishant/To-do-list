// ========== 1. GET ELEMENTS ==========
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearBtn = document.getElementById("clear");

const STORAGE_KEY = "todo-tasks";

// ========== 2. LOAD & SAVE (localStorage) ==========
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return []; // storage empty, blocked, or corrupted
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

// Each task looks like: { id: 123, text: "Buy milk", done: false }
let tasks = loadTasks();

// ========== 3. SHOW TASKS ON THE PAGE ==========
function render() {
  list.innerHTML = "";

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    // Checkbox: mark as completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark completed: " + task.text);
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // Task text (textContent keeps user input safe)
    const text = document.createElement("span");
    text.textContent = task.text;

    // Remove button
    const remove = document.createElement("button");
    remove.className = "remove";
    remove.type = "button";
    remove.textContent = "\u00d7";
    remove.setAttribute("aria-label", "Remove task: " + task.text);
    remove.addEventListener("click", function () {
      removeTask(task.id);
    });

    li.append(checkbox, text, remove);
    list.appendChild(li);
  });

  // Empty message, remaining count, clear button
  const left = tasks.filter(function (t) { return !t.done; }).length;
  empty.hidden = tasks.length > 0;
  count.textContent = left + (left === 1 ? " task left" : " tasks left");
  clearBtn.hidden = !tasks.some(function (t) { return t.done; });
}

// ========== 4. ADD, TOGGLE, REMOVE ==========
function addTask(text) {
  tasks.push({ id: Date.now(), text: text, done: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    return t.id === id ? { id: t.id, text: t.text, done: !t.done } : t;
  });
  saveTasks();
  render();
}

function removeTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

// ========== 5. EVENTS ==========
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  const text = input.value.trim();
  if (text === "") return;
  addTask(text);
  input.value = "";
  input.focus();
});

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  render();
});

// ========== 6. START ==========
render();