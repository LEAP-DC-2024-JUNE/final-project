import express from "express";
export const userRouter = express.Router();
userRouter.get("/me");
userRouter.patch("/register");
userRouter.get("/");
userRouter.get("/:id");
