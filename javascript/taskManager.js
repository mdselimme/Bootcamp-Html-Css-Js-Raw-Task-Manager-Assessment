// Show error Common Function
const showSweatAlert = (err, icon) => {
  if (err && icon) {
    Swal.fire({
      icon: icon,
      title: `${err.message}`,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

// Creat Asynchronous Wrapper for get data from localStorage
const getDataFromDbAsyncFunc = async (item) => {
  return new Promise((resolve, reject) => {
    try {
      const taskValue = localStorage.getItem(item);
      resolve(taskValue);
    } catch (error) {
      reject(error);
    }
  });
};

// Creat Asynchronous Wrapper for set data to localStorage
const setDataOnTheDbAsyncFunc = async (item, value, message) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(item, value);
      resolve(message);
    } catch (error) {
      reject(error);
    }
  });
};

// Get data from Json Data from localStorage database
const getDataFromDb = async () => {
  try {
    const getTask = await getDataFromDbAsyncFunc("tasks");
    if (getTask) {
      return JSON.parse(getTask);
    }
    return [];
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
      return [];
    }
  }
};

// Show and Display All Data On the web page
const showDataOnTheWeb = (data) => {
  try {
    // task list element find by id
    const taskList = document.getElementById("taskList");
    const taskHead = document.getElementById("taskHead");
    taskList.textContent = "";
    // if no data added show this message
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
      <p>${element.remaining !== 0
            ? `${formatTime(element.remaining)} <button  title="Start Task" 
          class="complete-btn"
          onclick="startTimerFunc(${element.uniqueId})"
        >
          Start
        </button>`
            : `${formatTime(element.remaining)}`
          }</p>
      <div>
          ${element.completeTask === true
            ? `<div class="task-actions">
              <span title="task completed" class="complete-task"><i class="fa-solid fa-check"></i></span> 
              <button  title="Delete Task" 
          onclick="deleteTaskFromDb(${element.uniqueId})"
          class="delete-btn"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
              </div>`
            : `
      <div class="task-actions">
        <button  title="Mark Complete" 
          class="complete-btn"
          onclick="completeTaskFromTask(${element.uniqueId})" 
        >
          <i class="fa-regular fa-square-check"></i>
        </button>
        ${element.intervalId === null ? `<button title="Edit Task"
              onclick="updateDataDisplay(${element.uniqueId})"
              class="update-btn"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>` : ""}
        <button title="Delete Task" 
          onclick="deleteTaskFromDb(${element.uniqueId})"
          class="delete-btn"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `
          }
      </div>
    `;
        taskList.appendChild(div);
      });
    }
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// -- Add task in the localStorage database --
const addToTaskDb = async (task) => {
  try {
    const result = await getDataFromDb();
    const setTask = [...result, task];
    await saveToLocalStorage(setTask, {
      message: "Added Task Successfully",
      code: 200,
    });
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Get timer input value
const getTimerInputValue = (inputId) => {
  return parseInt(document.getElementById(inputId).value) || 0;
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const second = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(second).padStart(2, "0")}`;
};

// Find Input Data From Data Input Add to task
const addTask = async (event) => {
  event.preventDefault();
  try {
    // get and find all data from input to add to task
    const taskName = event.target.taskTitle.value;
    const taskDescription = event.target.taskDescription.value;
    const taskPriority = event.target.taskPriority.value;
    // Timer Value Find
    const hours = getTimerInputValue("task-hours");
    const minutes = getTimerInputValue("task-minutes");
    const seconds = getTimerInputValue("task-seconds");
    if (hours === 0 && seconds === 0 && minutes === 0) {
      showSweatAlert(
        { message: "Please Enter your task Complete Time" },
        "warning"
      );
      return;
    }
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    // Unique Id Maker
    const uniqueId = new Date().getTime().toString();
    const data = {
      uniqueId,
      taskName,
      taskDescription,
      taskPriority,
      totalSeconds,
      completeTask: false,
      remaining: totalSeconds,
      intervalId: null,
    };
    await addToTaskDb(data);
    await calledData();
    event.target.reset();
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Display data on the webpage

// Default Called Data form Db
const calledData = async () => {
  try {
    const getData = await getDataFromDb();
    showDataOnTheWeb(getData);
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Save Json Data To Local Storage
const saveToLocalStorage = async (data, message) => {
  try {
    const parseData = JSON.stringify(data);
    await setDataOnTheDbAsyncFunc("tasks", parseData, message).then((resp) =>
      showSweatAlert(resp, "success")
    );
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Delete Data From Local Storage
const deleteTaskFromDb = async (task) => {
  try {
    Swal.fire({
      title: "Are you sure ? ",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const allTask = await getDataFromDb();
        await startTimerFunc(task);
        const deleteTask = allTask.filter(
          (item) => parseInt(item.uniqueId) !== task
        );
        await saveToLocalStorage(deleteTask, {
          message: "Delete Task Successfully",
          code: 200,
        });
        await calledData();
      }
    });
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Find Task Data By Id
const findUniqueIdData = async (id) => {
  try {
    const allData = await getDataFromDb();
    const findData = allData.find((ele) => parseInt(ele.uniqueId) === id);
    return findData;
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};



// start timer function
const startTimerFunc = async (id) => {
  const task = await findUniqueIdData(id);
  const allTaskData = await getDataFromDb();
  const index = allTaskData.findIndex((t) => t.uniqueId === id.toString());
  console.log(task)
  if (!task || task.completeTask) {
    clearInterval(task.intervalId);
    return;
  }
  if (task.intervalId) {
    clearInterval(task.intervalId);
    task.intervalId = null;
    task.remaining = 0;
  } else {
    task.intervalId = setInterval(async () => {
      task.remaining--;
      if (task.remaining <= 0) {
        clearInterval(task.intervalId);
        task.completeTask = true;
      }
      allTaskData[index] = task;
      if (task.completeTask === true) {
        await saveToLocalStorage(allTaskData, {
          message: "Task Completed ? Because Timer is over",
        });
        calledData();
      }
      await saveToLocalStorage(allTaskData, undefined);
      calledData();
    }, 1000);
  }
};

// Update Display Form Data Show
const updateDataDisplay = async (id) => {
  try {
    const findData = await findUniqueIdData(id);
    document.getElementById("UpdateToTaskBox").style.display = "block";
    document.getElementById("addToTaskBox").style.display = "none";
    // find all element to update display data
    const uniqueId = document.getElementById("uniqueId");
    const upTaskTitle = document.getElementById("updateTaskTitle");
    const upTaskDescription = document.getElementById("updateTaskDescription");
    const updateTaskPriority = document.getElementById("updateTaskPriority");
    const updateTaskHours = document.getElementById("up-task-hours");
    const updateTaskMinutes = document.getElementById("up-task-minutes");
    const updateTaskSeconds = document.getElementById("up-task-seconds");
    // Show All Element Value 
    uniqueId.value = findData.uniqueId;
    upTaskTitle.value = findData.taskName;
    upTaskDescription.value = findData.taskDescription;
    updateTaskPriority.value = findData.taskPriority;
    // Time Status Show 
    const hours = Math.floor(findData.totalSeconds / 3600);
    const minutes = Math.floor((findData.totalSeconds % 3600) / 60);
    const second = findData.totalSeconds % 60;
    updateTaskHours.value = hours;
    updateTaskMinutes.value = minutes;
    updateTaskSeconds.value = second;
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Update Form Find Data and Update the Specific Element Of the task list and show Alert
const UpdateTaskForm = async (event) => {
  console.log(event)
  event.preventDefault();
  try {
    const allData = await getDataFromDb();
    // find all input data
    const uniqueId = event.target.uniqueId.value;
    const taskName = event.target.taskTitle.value;
    console.log(taskName)
    const taskDescription = event.target.taskDescription.value;
    const taskPriority = event.target.taskPriority.value;
    // Timer Value Find
    const hours = getTimerInputValue("up-task-hours");
    const minutes = getTimerInputValue("up-task-minutes");
    const seconds = getTimerInputValue("up-task-seconds");

    if (hours === 0 && seconds === 0 && minutes === 0) {
      showSweatAlert(
        { message: "Please Enter your task Complete Time" },
        "warning"
      );
      return;
    }
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    // matches data find
    const index = allData.findIndex((data) => data.uniqueId === uniqueId);
    console.log(allData[index])
    allData[index].taskName = taskName;
    allData[index].taskDescription = taskDescription;
    allData[index].taskPriority = taskPriority;
    allData[index].totalSeconds = totalSeconds;
    allData[index].remaining = totalSeconds;
    await saveToLocalStorage(allData, {
      message: "Update Task Successfully",
      code: 200,
    });
    calledData();
    document.getElementById("UpdateToTaskBox").style.display = "none";
    document.getElementById("addToTaskBox").style.display = "block";
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Search Data From Task List
const searchTextInput = async (event) => {
  try {
    const searchText = event.target.value;
    const allData = await getDataFromDb();
    const searchFindData = allData.filter((task) =>
      task.taskName.toLowerCase().includes(searchText.toLowerCase())
    );
    // if cannot find any matches data
    if (searchFindData.length > 0) {
      showDataOnTheWeb(searchFindData);
    } else {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = `<h1 class="show-no-task">No Match Found</h1>`;
    }
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Complete Task From Task List Added
const completeTaskFromTask = async (id) => {
  try {
    const allData = await getDataFromDb();
    // filtering the data with id
    const index = allData.findIndex((data) => parseInt(data.uniqueId) === id);
    allData[index].completeTask = true;
    allData[index].remaining = 0;
    await saveToLocalStorage(allData, {
      message: "Complete Task Successfully",
      code: 200,
    });
    await startTimerFunc(id);
    calledData();
  } catch (err) {
    if (err) {
      showSweatAlert(err, "warning");
    }
  }
};

// Sort Method By Complete or inComplete
const sortMethodFunc = async (event) => {
  const selectedValue = event.target.value;
  const allTask = await getDataFromDb();
  // Matches Find filter
  let filterTask;
  if (selectedValue === "All") {
    filterTask = allTask;
  } else if (selectedValue === "Completed") {
    filterTask = allTask.filter((task) => task.completeTask);
  } else if (selectedValue === "Incompleted") {
    filterTask = allTask.filter((task) => !task.completeTask);
  }
  // If no matches found
  if (filterTask.length > 0) {
    showDataOnTheWeb(filterTask);
  } else {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = `<h1 class="show-no-task">No Match Found</h1>`;
  }
};
