const API = "http://localhost:5000";

async function addTask() {
  const title = document.getElementById("task-title").value;
  const deadline = document.getElementById("task-deadline").value;
  const priority = document.getElementById("task-priority").value;

  if (!title.trim()) return;

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, deadline, priority }),
  });

  document.getElementById("task-title").value = "";
  document.getElementById("task-deadline").value = "";
  loadTasks();
}

async function loadTasks() {
  const status = document.getElementById("status-filter").value;
  const deadline = document.getElementById("deadline-filter").value;

  let url = `${API}/tasks`;
  if (status || deadline) {
    url = `${API}/tasks/filter?${status ? `status=${status}&` : ""}${deadline ? `deadline=${deadline}` : ""}`;
  }

  const res = await fetch(url);
  const tasks = await res.json();
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete('${task.id}', this.checked)" />
      <strong>${task.title}</strong> - Priority: ${task.priority} - Due: ${task.deadline || "N/A"}
    `;
    list.appendChild(li);
  });
}

async function toggleComplete(id, completed) {
  await fetch(`${API}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  loadTasks();
}

window.onload = loadTasks;
