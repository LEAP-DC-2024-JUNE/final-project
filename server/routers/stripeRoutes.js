import express from "express";
import {
  createCheckoutSession,
  getStripeSession,
} from "../controllers/stripeController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const stripeRouter = express.Router();

stripeRouter.post("/", authenticateUser, createCheckoutSession);
stripeRouter.get("/session", authenticateUser, getStripeSession);

export default stripeRouter;
