const { validationResult } = require("express-validator");
const {
  createTasck,
  getTasckFilter,
  getTaskById,
  updateTask,
  deleteTask,
  changeStatus
} = require("../services/tasksServices");

const createTasckController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const tasck = await createTasck(req.body);
    return res.status(201).json({
      message: "tasck create successfully",
      tasck,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getTasckFilterController = async (req, res, next) => {
  try {
    const { status, title } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }
    const tascks = await getTasckFilter(filter);
    return res.status(200).json(tascks);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getTaskByIdController = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "task not found",
      });
    }
    return res.status(200).json({
      message: "successfull",
      task,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateTaskController = async (req, res, next) => {
  try {
    const data = req.body;
    const taskId = req.params.id;
    const newTask = await updateTask(data, taskId);
    return res.status(200).json({
      message: "the task id updated successfully",
      newTask,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteTaskController = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await deleteTask(taskId);
    return res.status(204).json({
      message: "the task is deleted",
      task,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const changeStatusController = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    const updatedTask = await changeStatus(taskId, status);

    return res.status(200).json({
      message: "Task status changed successfully",
      task: updatedTask
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  createTasckController,
  getTasckFilterController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  changeStatusController
};
