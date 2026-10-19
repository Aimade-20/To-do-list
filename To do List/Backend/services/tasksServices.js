const Tasks = require("../models/tasks");

const createTasck = async (data) => {
  const newTasck = await Tasks.create({ ...data });
  return newTasck;
};

const getTasckFilter = async (filters) => {
  const tascks = await Tasks.find(filters);
  return tascks;
};

const getTaskById = async (taskId) => {
  const tasck = await Tasks.findById(taskId);
  return tasck;
};

const updateTask = async (data, taskId) => {
  const tasck = await Tasks.findById(taskId);
  if (!tasck) {
    throw new Error("task not found");
  }
  const newTask = await Tasks.findByIdAndUpdate(taskId, data, {
    new: true,
    runValidators: true,
  });
  return newTask;
};

const deleteTask = async (taskId) => {
  const task = await Tasks.findByIdAndDelete(taskId);
  if (!task) {
    throw new Error("task not found");
  }
  return task;
};


const changeStatus = async (taskId, status) => {
  const task = await Tasks.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  task.status = status;

  const updatedTask = await task.save();

  return updatedTask;
};
module.exports = {
  createTasck,
  getTasckFilter,
  getTaskById,
  updateTask,
  deleteTask,
  changeStatus
};
