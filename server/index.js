import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routers/user.router";
PORT = process.env.PORT;
const app = express();
app.use("/api/users", userRouter);
app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
