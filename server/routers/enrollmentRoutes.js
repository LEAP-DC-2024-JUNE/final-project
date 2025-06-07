import express from "express";
import {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentsByUser,
  getEnrollmentsByCourse,
} from "../controllers/enrollmentController.js";
import { createEnrollmentWithPayment } from "../controllers/enrollmentWithPaymentController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const enrollmentRouter = express.Router();

//  Create a new enrollment (only the logged-in user can enroll themselves)
enrollmentRouter.post("/", authenticateUser, createEnrollment);

// Create enrollment + payment together
enrollmentRouter.post(
  "/with-payment",
  authenticateUser,
  createEnrollmentWithPayment
);

// Admin/Instructor: Get all enrollments
enrollmentRouter.get(
  "/",
  authenticateUser,
  authorizeRoles("INSTRUCTOR", "ADMIN"),
  getAllEnrollments
);

//  User: Get their own enrollments
enrollmentRouter.get("/user/:userId", authenticateUser, getEnrollmentsByUser);

//  Instructor/Admin: Get enrollments for a course
enrollmentRouter.get(
  "/course/:courseId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR", "ADMIN"),
  getEnrollmentsByCourse
);

export default enrollmentRouter;
