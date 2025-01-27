// Get data from Json Data from localStorage database
const getDataFromDb = () => {
  const getTask = localStorage.getItem("tasks");
  if (getTask) {
    return JSON.parse(getTask);
  }
  return [];
};

// Find Input Data From Data Input Add to task
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

// Display data on the webpage
const showDataOnTheWeb = (data) => {
  const taskList = document.getElementById("taskList");
  const taskHead = document.getElementById("taskHead");
  taskList.textContent = "";
  if (data.length === 0) {
    taskHead.style.display = "none";
    taskList.innerHTML = `<h1 class="show-no-task">No Task Added</h1>`;
  } else {
    taskHead.style.display = "block";
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
      <button onclick="updateDataDisplay(${element.uniqueId})" class="update-btn">Update</button>
      <button onclick="deleteTaskFromDb(${element.uniqueId})" class="delete-btn">Delete</button>
      </div>
    `;
      taskList.appendChild(div);
    });
  }
};

// Save Json Data To Local Storage
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
const findUniqueIdData = (id) => {
  const allData = getDataFromDb();
  const findData = allData.find((ele) => parseInt(ele.uniqueId) === id);
  return findData;
};

// Update Display Form Data Show
const updateDataDisplay = (id) => {
  const findData = findUniqueIdData(id);
  document.getElementById("UpdateToTaskBox").style.display = "block";
  document.getElementById("addToTaskBox").style.display = "none";
  const uniqueId = document.getElementById("uniqueId");
  const upTaskTitle = document.getElementById("updateTaskTitle");
  const upTaskDescription = document.getElementById("updateTaskDescription");
  const updateTaskPriority = document.getElementById("updateTaskPriority");
  uniqueId.value = findData.uniqueId;
  upTaskTitle.value = findData.taskName;
  upTaskDescription.value = findData.taskDescription;
  updateTaskPriority.value = findData.taskPriority;
};

// Update Form Find Data and Update the Specific Element Of the task list and show Alert
const UpdateTaskForm = (event) => {
  event.preventDefault();
  const allData = getDataFromDb();
  const uniqueId = event.target.uniqueId.value;
  const taskName = event.target.taskTitle.value;
  const taskDescription = event.target.taskDescription.value;
  const taskPriority = event.target.taskPriority.value;
  const index = allData.findIndex((data) => data.uniqueId === uniqueId);
  allData[index] = { uniqueId, taskName, taskDescription, taskPriority };
  saveToLocalStorage(allData);
  calledData();
  Swal.fire({
    icon: "success",
    title: "Task Update Successfully",
    showConfirmButton: false,
    timer: 1500,
  });
  document.getElementById("UpdateToTaskBox").style.display = "none";
  document.getElementById("addToTaskBox").style.display = "block";
};

// Default Called Data form Db
const calledData = () => {
  const getData = getDataFromDb();
  showDataOnTheWeb(getData);
};
