import express from "express";
import {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentsByCourse,
  getEnrollmentsByUser,
} from "../controllers/enrollmentController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const enrollmentRouter = express.Router();

enrollmentRouter.get(
  "/",
  authenticateUser,
  authorizeRoles("INSTRUCTOR", "ADMIN"),
  getAllEnrollments
);
enrollmentRouter.get("/user/:userId", authenticateUser, getEnrollmentsByUser);
enrollmentRouter.get(
  "/course/:courseId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  getEnrollmentsByCourse
);
enrollmentRouter.post("/", authenticateUser, createEnrollment);

export default enrollmentRouter;
