import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routers/userRoutes.js";
import courseRouter from "./routers/courseRoutes.js";
import sectionRouter from "./routers/sectionRoutes.js";
import videoRouter from "./routers/videoRoutes.js";
import paymentRouter from "./routers/paymentRoutes.js";
import enrollmentRouter from "./routers/enrollmentRoutes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const PORT = 3001;

let prisma;
if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}
prisma = globalThis.prisma;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://suraafrontend.vercel.app"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});
app.set("trust proxy", 1);

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
});

app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
