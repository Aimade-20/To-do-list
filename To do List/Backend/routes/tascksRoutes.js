const express = require("express");

const router = express.Router();

const {
  createTasckController,
  getTasckFilterController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  changeStatusController
} = require("../controller/tasckController");

const tasckValidation = require("../validation/tasckValidation");

router.post("/tasks", tasckValidation, createTasckController);
router.get("/tasks", getTasckFilterController);
router.get("/tasks/:id", getTaskByIdController);
router.put("/tasks/:id", tasckValidation, updateTaskController);
router.delete("/tasks/:id",deleteTaskController)
router.patch("/tasks/:id/status", changeStatusController);

module.exports = router;
