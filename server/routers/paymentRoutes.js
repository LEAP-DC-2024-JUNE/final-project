import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentsByUser,
  getPaymentsByCourse,
} from "../controllers/paymentController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const paymentRouter = express.Router();

// Create a payment (student)
paymentRouter.post("/", authenticateUser, createPayment);

// Admin: Get all payments
paymentRouter.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getAllPayments
);

// User: Get their own payments
paymentRouter.get("/user/:userId", authenticateUser, getPaymentsByUser);

// Instructor/Admin: Get all payments for a specific course
paymentRouter.get(
  "/course/:courseId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR", "ADMIN"),
  getPaymentsByCourse
);

export default paymentRouter;
