import express from "express";
import controller from "../controllers/task";
import { Schemas, ValidateJoi } from "../middleware/Joi";
import { verifyJWT } from "../middleware/auth";
import subTasksController from "../controllers/subtask";

const router = express.Router();

router.get("", verifyJWT, controller.get);
router.get("/:id", verifyJWT, controller.getById);
router.post("", verifyJWT, ValidateJoi(Schemas.task.create), controller.create);
router.put(
  "/:id",
  verifyJWT,
  ValidateJoi(Schemas.task.update),
  controller.update
);
router.delete("/:id", verifyJWT, controller.remove);

router.get("/:id/subtasks", verifyJWT, subTasksController.get);
router.put("/:id/subtasks", verifyJWT,ValidateJoi(Schemas.subtask.update), subTasksController.update);

export default router;
