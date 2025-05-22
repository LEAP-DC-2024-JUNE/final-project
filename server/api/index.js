import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "../routers/userRoutes.js";
import courseRouter from "../routers/courseRoutes.js";
import sectionRouter from "../routers/sectionRoutes.js";
import videoRouter from "../routers/videoRoutes.js";
import paymentRouter from "../routers/paymentRoutes.js";
import enrollmentRouter from "../routers/enrollmentRoutes.js";

const app = express();
const PORT = 3001;

app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://suraafrontend.vercel.app",
    credentials: true,
  })
);

app.use(clerkMiddleware());

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/videos", videoRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/enrollments", enrollmentRouter);

app.get("/", (req, res) => res.send("Express on Vercel"));
app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
