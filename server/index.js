import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routers/userRoutes.js";
import courseRouter from "./routers/courseRoutes.js";
import sectionRouter from "./routers/sectionRoutes.js";
import videoRouter from "./routers/videoRoutes.js";
import paymentRouter from "./routers/paymentRoutes.js";
import enrollmentRouter from "./routers/enrollmentRoutes.js";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma/prisma.js";

const app = express();
const PORT = 3001;

app.use(express.json());

let prisma;
if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}
prisma = globalThis.prisma;

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

app.get("/", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ status: "Connected to database" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      error: "Database connection error",
      details: error.message,
    });
  }
  // Don't disconnect here as it might affect other routes
});

// app.get("/", (req, res) => res.send("Express on Vercel"));
app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
