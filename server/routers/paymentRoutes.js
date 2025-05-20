import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentsByCourse,
  getPaymentsByUser,
} from "../controllers/paymentController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";

const paymentRouter = express.Router();

paymentRouter.get(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getAllPayments
);
paymentRouter.get("/user/:userId", authenticateUser, getPaymentsByUser);
paymentRouter.get(
  "/course/:courseId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  getPaymentsByCourse
);
paymentRouter.post("/", authenticateUser, createPayment);

export default paymentRouter;
