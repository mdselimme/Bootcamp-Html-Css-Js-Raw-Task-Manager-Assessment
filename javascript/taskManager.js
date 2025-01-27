console.log("Task Manager");

// Get data from localStorage database
const getDataFromDb = () => {
  const getTask = localStorage.getItem("tasks");
  if (getTask) {
    return JSON.parse(getTask);
  }
  return [];
};

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

// Find Task Data By Id
// const findUniqueIdData = (id) => {
document.getElementById("UpdateToTaskBox").style.display = "block";
document.getElementById("addToTaskBox").style.display = "none";
//   const allData = getDataFromDb();
//   const findData = allData.find((ele) => parseInt(ele.uniqueId) === id);
//   const upTaskTitle = document.getElementById("updateTaskTitle");
//   const upTaskDescription = document.getElementById("updateTaskDescription");
//   const updateTaskPriority = document.getElementById("updateTaskPriority");
//   upTaskTitle.value = findData.taskName;
//   upTaskDescription.value = findData.taskDescription;
//   updateTaskPriority.value = findData.taskPriority;
// };

const updateData = (id) => {
  // findUniqueIdData(id);
  const allData = getDataFromDb();
  document.getElementById("UpdateToTaskBox").style.display = "block";
  document.getElementById("addToTaskBox").style.display = "none";
  const findData = allData.find((ele) => parseInt(ele.uniqueId) === id);
  const uniqueId = document.getElementById("uniqueId");
  const upTaskTitle = document.getElementById("updateTaskTitle");
  const upTaskDescription = document.getElementById("updateTaskDescription");
  const updateTaskPriority = document.getElementById("updateTaskPriority");
  uniqueId.value = findData.uniqueId;
  upTaskTitle.value = findData.taskName;
  upTaskDescription.value = findData.taskDescription;
  updateTaskPriority.value = findData.taskPriority;
  // document.getElementById("updateTaskTitle").value = findData.taskName;
  // document.getElementById("updateTaskDescription").value =
  //   findData.taskDescription;
  // document.getElementById("updateTaskPriority").value = findData.taskPriority;
  // showUpdateDataInInput(findData);
};

// const showUpdateDataInInput = (tasksData) => {
//   console.log("showdata = ", tasksData);
//   document.getElementById("updateTaskTitle").value = tasksData.taskName;
//   document.getElementById("updateTaskDescription").value =
//     tasksData.taskDescription;
//   document.getElementById("updateTaskPriority").value = tasksData.taskPriority;
// };

const UpdateTaskForm = (event) => {
  event.preventDefault();
  const uniqueId = event.target.uniqueId.value;
  const taskName = event.target.taskTitle.value;
  const taskDescription = event.target.taskDescription.value;
  const taskPriority = event.target.taskPriority.value;
  console.log(uniqueId, taskName, taskDescription, taskPriority);
};

// Default Called Data form Db
const calledData = () => {
  const getData = getDataFromDb();
  showDataOnTheWeb(getData);
};

calledData();
