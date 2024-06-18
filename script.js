// navbar
const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".nav-items");
const form = document.querySelector("form");
menuBtn.onclick = () => {
  items.classList.add("active");
  menuBtn.classList.add("hide");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
};
cancelBtn.onclick = () => {
  items.classList.remove("active");
  menuBtn.classList.remove("hide");
  searchBtn.classList.remove("hide");
  cancelBtn.classList.remove("show");
  form.classList.remove("active");
  cancelBtn.style.color = "#ff3d00";
};
searchBtn.onclick = () => {
  form.classList.add("active");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
};

//*******tasks*********

// const colorPalette = ["#212A31", "#2e2944", "#124e66", "#748d92"];
// const colorPalette = ["#635985", "#443C68", "#393053", "#18122B"];

const originalColorPalette = [
  "#2c3e50", "#34495e", "#22313f", "#3a539b", "#1e2f4f",
  "#2c2a4a", "#413e4a", "#4e3a4a", "#512b58", "#3b3054",
  "#2e313d", "#3b3b58", "#222831", "#393e46", "#48466d",
  "#464866", "#353535", "#4a4a4a", "#515151", "#2f3640",
  "#353b48", "#2d3436", "#2c2c54", "#30336b", "#535c68",
  "#6c5ce7", "#4c5c68", "#5d6d7e", "#34495e", "#2d3436",
  "#283747", "#212f3c", "#1c2833", "#273746", "#2e4053",
  "#1f2d3a", "#3a3b3c", "#212f3c", "#1c2833", "#2a2b2d",
  "#1B263B", "#2E4057", "#34495E", "#5D6D7E", "#85929E",
  "#283747", "#212F3C", "#2C3E50", "#1F618D", "#2980B9",
  "#2874A6", "#3498DB", "#1A5276", "#1B4F72", "#154360",
  "#2D3E50", "#566573", "#5D6D7E", "#1C2833", "#283747",
  "#2C3E50", "#5B2C6F", "#6C3483", "#7D3C98", "#8E44AD",
  "#512E5F", "#4A235A", "#922B21", "#7B241C", "#641E16",
  "#7D6608", "#B7950B", "#A04000", "#BA4A00", "#6E2C00",
  "#7E5109", "#9A7D0A", "#D4AC0D", "#CA6F1E", "#873600"
  
];



let availableColors = [...originalColorPalette];

function getRandomColor() {
  // If no colors are left, reset the available colors
  if (availableColors.length === 0) {
    availableColors = [...originalColorPalette];
  }

  // Select a random color from the available colors
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomIndex];

  // Remove the selected color from the available colors
  availableColors.splice(randomIndex, 1);

  return color;
}


let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const titleInput = document.getElementById("taskTitle");
  const descriptionInput = document.getElementById("taskDescription");
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (title === "" || description === "") {
    alert("Please enter both title and description.");
    return;
  }

  
  const task = {
    title,
    description,
    date: new Date().toLocaleDateString(),
    // color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    color: getRandomColor(),
  };
  taskList.push(task);

  saveTasksListToLocalStorage();

  titleInput.value = "";
  descriptionInput.value = "";

  displayTask();

  closeModal();
}

function displayTask() {
  const taskContainer = document.querySelector(".task-list");
  taskContainer.innerHTML = "";

  taskList.forEach((task, index) => {
    const taskCard = createTaskCard(task, index);
    taskContainer.appendChild(taskCard);
  });
}



function createTaskCard(task, index) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");
  taskCard.style.backgroundColor = task.color;

  const html = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><b>Added on:${task.date}</b></p>
        <div class="options">
        <button class="button" onclick="openModal('view', ${index})">
            <i class="fa fa-eye" aria-label="View"></i>
            <span class="tooltip">View</span>
        </button>
        <button class="button" onclick="openModal('edit', ${index})">
            <i class="fa fa-edit" aria-label="Edit"></i>
            <span class="tooltip">Edit</span>
        </button>
        <button class="button" onclick="deletetask(${index})">
            <i class="fa fa-trash" aria-label="Delete"></i>
            <span class="tooltip">Delete</span>
        </button>
        <button class="button" onclick="toggleTaskCompletion(${index})">
        <i class="fa-regular fa-square-check" aria-label="Complete"></i>
        <span class="tooltip">Mark as complete</span>
      </button>
        </div>
         `;
  taskCard.innerHTML = html;
  return taskCard;
}
function toggleTaskCompletion(index) {
  const task = document.querySelectorAll('.task-card h3')[index];
  task.classList.toggle('completed');
}

function openModal(mode, index) {
  const modal = document.getElementById("addTaskModal");
  const titleInput = document.getElementById("taskTitle");
  const descriptionInput = document.getElementById("taskDescription");
  const actionButton = document.getElementById("actionButton");

  if (mode === "view") {
    const task = taskList[index];
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    actionButton.style.display = "none";
  } else if (mode === "edit") {
    const task = taskList[index];
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    actionButton.textContent = "Save Changes";
    actionButton.onclick = () => saveChanges(index);
    actionButton.style.display = "block";
  }
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("addTaskModal");
  modal.style.display = "none";
}

function deletetask(index) {
  taskList.splice(index, 1);
  saveTasksListToLocalStorage();
  displayTask();
}

function saveChanges(index) {
  const titleInput = document.getElementById("taskTitle");
  const descriptionInput = document.getElementById("taskDescription");

  const newTitle = titleInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  if (newTitle === "" || newDescription === "") {
    alert("Please enter both title and description.");
    return;
  }

  const task = taskList[index];
  task.title = newTitle;
  task.description = newDescription;
  saveTasksListToLocalStorage();
  displayTask();
  closeModal();
}

function saveTasksListToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

displayTask();

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

//task search
