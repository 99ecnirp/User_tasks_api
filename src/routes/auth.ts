import express from "express";
import { authController } from "../controllers";
import { Schemas, ValidateJoi } from "../middleware/Joi";
import { verifyJWT } from "../middleware/auth";

const router = express.Router();

router.post(
  "/register",
  ValidateJoi(Schemas.user.create),
  authController.register
);
router.post("/login", ValidateJoi(Schemas.user.login), authController.login);
router.post("/logout", verifyJWT, authController.logout);

export default router;
