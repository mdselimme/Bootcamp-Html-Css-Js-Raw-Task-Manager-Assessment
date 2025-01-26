console.log("Task Manager");

// Find Input Data From Data Input
const addTask = (event) => {
  event.preventDefault();
  const taskName = event.target.taskTitle.value;
  const taskDescription = event.target.taskDescription.value;
  const taskPriority = event.target.taskPriority.value;
  const uniqueId = new Date().getTime().toString();
  const data = { uniqueId, taskName, taskDescription, taskPriority };
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
      <button onclick="deleteTaskFromDb(${element.uniqueId})" class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });
};

const saveToLocalStorage = (data) => {
  const parseData = JSON.stringify(data);
  localStorage.setItem("tasks", parseData);
};

// -- Add task in the localStorage database --
const addToTaskDb = (task) => {
  const result = getDataFromDb();
  const setTask = [...result, task];
  saveToLocalStorage(setTask);
  Swal.fire({
    icon: "success",
    title: "Add Task Successfully",
    showConfirmButton: false,
    timer: 1500,
  });
};

const deleteTaskFromDb = (task) => {
  Swal.fire({
    title: "Are you sure ? ",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const allTask = getDataFromDb();
      allTask.forEach((err) => {
        console.log(err.uniqueId);
      });
      const deleteTask = allTask.filter(
        (item) => parseInt(item.uniqueId) !== task
      );
      saveToLocalStorage(deleteTask);
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      calledData();
    }
  });

  console.log("delete", deleteTask);
};

const calledData = () => {
  const getData = getDataFromDb();
  showDataOnTheWeb(getData);
};

calledData();
