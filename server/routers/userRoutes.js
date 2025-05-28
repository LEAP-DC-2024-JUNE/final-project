import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  syncUser,
} from "../controllers/userController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.post("/sync", syncUser);

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
