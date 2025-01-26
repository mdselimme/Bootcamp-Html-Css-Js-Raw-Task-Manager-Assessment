console.log("Task Manager");

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
};

const getDataFromDb = () => {
  const getTask = localStorage.getItem("tasks");
  if (getTask) {
    return JSON.parse(getTask);
  }
  return [];
};

const showDataOnTheWeb = (data) => {
  console.log(data);
};

const addToTaskDb = (task) => {
  const result = getDataFromDb();
  const setTask = [...result, task];
  const parseData = JSON.stringify(setTask);
  localStorage.setItem("tasks", parseData);
};
