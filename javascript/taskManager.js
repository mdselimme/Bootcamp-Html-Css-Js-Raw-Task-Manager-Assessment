console.log("Task Manager");

// Find Input Data From Data Input
const addTask = (event) => {
  event.preventDefault();
  const taskName = event.target.taskTitle.value;
  const taskDescription = event.target.taskDescription.value;
  const taskPriority = event.target.taskPriority.value;
  console.log(taskName, taskDescription, taskPriority);
  const uniqueId = new Date().getTime().toString();
  console.log(uniqueId);
  const data = { uniqueId, taskName, taskDescription, taskPriority };
  console.log(data);
  addToTaskDb(data);
  const getData = getDataFromDb();
  showDataOnTheWeb(getData);
  event.target.reset();
};

// Get data from localStorage database
const getDataFromDb = () => {
  const getTask = localStorage.getItem("tasks");
  if (getTask) {
    return JSON.parse(getTask);
  }
  return [];
};

// Display data on the website
const showDataOnTheWeb = (data) => {
  const taskList = document.getElementById("taskList");
  taskList.textContent = "";
  data.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("task-item");
    div.innerHTML = ` 
      <p>${element.uniqueId}</p>
      <p>${element.taskName}</p>
      <p>${element.taskDescription}</p>
      <p>${element.taskPriority}</p>
      <div class="task-actions">
      <button class="complete-btn">Complete</button>
      <button class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });
  console.log(data, taskList);
};

// -- Add task in the localStorage database --
const addToTaskDb = (task) => {
  const result = getDataFromDb();
  const setTask = [...result, task];
  const parseData = JSON.stringify(setTask);
  localStorage.setItem("tasks", parseData);
};

const getData = getDataFromDb();
showDataOnTheWeb(getData);
