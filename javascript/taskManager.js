// Show error Common Function
const showErrorCommonFunc = (err) => {
  Swal.fire({
    icon: "warning",
    title: `Message ${err}`,
    showConfirmButton: false,
    timer: 1500,
  });
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
const setDataOnTheDbAsyncFunc = async (item, value) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(item, value);
      resolve("Save data Successfully");
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
      showErrorCommonFunc(err);
      return [];
    }
  }
};

// Show and Display All Data On the web page
const showDataOnTheWeb = (data) => {
  try {
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
      <div>
          ${
            element.completeTask === true
              ? `<div class="task-actions">
              <span class="complete-task">Completed</span> <button
          onclick="deleteTaskFromDb(${element.uniqueId})"
          class="delete-btn"
        >
          Delete Task
        </button>
              </div>`
              : `
      <div class="task-actions">
        <button
          class="complete-btn"
          onclick="completeTaskFromTask(${element.uniqueId})"
        >
          Mark Complete
        </button>
        <button
          onclick="updateDataDisplay(${element.uniqueId})"
          class="update-btn"
        >
          Update
        </button>
        <button
          onclick="deleteTaskFromDb(${element.uniqueId})"
          class="delete-btn"
        >
          Delete
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
      showErrorCommonFunc(err);
    }
  }
};

// -- Add task in the localStorage database --
const addToTaskDb = async (task) => {
  try {
    const result = await getDataFromDb();
    const setTask = [...result, task];
    await saveToLocalStorage(setTask);
    Swal.fire({
      icon: "success",
      title: "Add Task Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
    }
  }
};

// Find Input Data From Data Input Add to task
const addTask = async (event) => {
  event.preventDefault();
  try {
    const taskName = event.target.taskTitle.value;
    const taskDescription = event.target.taskDescription.value;
    const taskPriority = event.target.taskPriority.value;
    const uniqueId = new Date().getTime().toString();
    const data = { uniqueId, taskName, taskDescription, taskPriority };
    await addToTaskDb(data);
    await calledData();
    event.target.reset();
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
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
      showErrorCommonFunc(err);
    }
  }
};

// Save Json Data To Local Storage
const saveToLocalStorage = async (data) => {
  try {
    const parseData = JSON.stringify(data);
    await setDataOnTheDbAsyncFunc("tasks", parseData);
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
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

        const deleteTask = allTask.filter(
          (item) => parseInt(item.uniqueId) !== task
        );
        await saveToLocalStorage(deleteTask);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        await calledData();
      }
    });
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
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
      showErrorCommonFunc(err);
    }
  }
};

// Update Display Form Data Show
const updateDataDisplay = async (id) => {
  try {
    const findData = await findUniqueIdData(id);
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
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
    }
  }
};

// Update Form Find Data and Update the Specific Element Of the task list and show Alert
const UpdateTaskForm = async (event) => {
  event.preventDefault();
  try {
    const allData = await getDataFromDb();
    const uniqueId = event.target.uniqueId.value;
    const taskName = event.target.taskTitle.value;
    const taskDescription = event.target.taskDescription.value;
    const taskPriority = event.target.taskPriority.value;
    const index = allData.findIndex((data) => data.uniqueId === uniqueId);
    allData[index] = { uniqueId, taskName, taskDescription, taskPriority };
    await saveToLocalStorage(allData);
    await calledData();
    Swal.fire({
      icon: "success",
      title: "Task Update Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("UpdateToTaskBox").style.display = "none";
    document.getElementById("addToTaskBox").style.display = "block";
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
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
    if (searchFindData.length > 0) {
      showDataOnTheWeb(searchFindData);
    } else {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = `<h1 class="show-no-task">No Match Found</h1>`;
    }
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
    }
  }
};

// Complete Task From Task List Added
const completeTaskFromTask = async (id) => {
  try {
    const allData = await getDataFromDb();
    const index = allData.findIndex((data) => parseInt(data.uniqueId) === id);
    allData[index].completeTask = true;
    await saveToLocalStorage(allData);
    await calledData();
  } catch (err) {
    if (err) {
      showErrorCommonFunc(err);
    }
  }
};
