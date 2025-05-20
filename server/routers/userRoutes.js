import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";

const userRouter = express.Router();

userRouter.get("/", authenticateUser, authorizeRoles("ADMIN"), getAllUsers);
userRouter.get("/me", authenticateUser, getUserById);
userRouter.patch("/:id", authenticateUser, updateUser);
userRouter.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  deleteUser
);

export default userRouter;
