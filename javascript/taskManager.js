console.log("Task Manager");

const addTask = (event) => {
  event.preventDefault();
  const taskName = event.target.taskTitle.value;
  const taskDescription = event.target.taskDescription.value;
  const taskPriority = event.target.taskPriority.value;
  console.log(taskName, taskDescription, taskPriority);
};
