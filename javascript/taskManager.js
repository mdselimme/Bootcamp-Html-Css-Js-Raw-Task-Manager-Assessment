console.log("Task Manager");

// Find Input Data From Data Input
const addTask = () => {
  const taskName = document.getElementById("taskTitle").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;
  const uniqueId = new Date().getTime().toString();
  const data = { uniqueId, taskName, taskDescription, taskPriority };
  addToTaskDb(data);
  const getData = getDataFromDb();
  showDataOnTheWeb(getData);
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
      <button onclick="updateData(${element.uniqueId})" class="update-btn">Update</button>
      <button onclick="deleteTaskFromDb(${element.uniqueId})" class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });
};

// Save Data To Local Storage
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

// Delete Data From Local Storage
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
};

const findUniqueIdData = (id) => {
  const allData = getDataFromDb();
  const findData = allData.find((ele) => parseInt(ele.uniqueId) === id);
  return findData;
};

const updateData = (id) => {
  const findData = findUniqueIdData(id);
  const updateBtn = document.getElementById("updateBtn");
  const submitBtn = document.getElementById("submitBtn");
  updateBtn.style.display = "block";
  submitBtn.style.display = "none";
  showUpdateDataInInput(findData);
};

const showUpdateDataInInput = (tasksData) => {
  const title = document.getElementById("taskTitle");
  const description = document.getElementById("taskDescription");
  const priority = document.getElementById("taskPriority");
  title.value = tasksData.taskName;
  description.value = tasksData.taskDescription;
  priority.value = tasksData.taskPriority;
};

const updateTaskDataAndSaveToDb = () => {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;
  console.log("update data = ", title, description, priority);
};

// Default Called Data form Db
const calledData = () => {
  const getData = getDataFromDb();
  showDataOnTheWeb(getData);
};

calledData();
