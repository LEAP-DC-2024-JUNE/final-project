import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routers/userRoutes";
import courseRouter from "./routers/courseRoutes";
import sectionRouter from "./routers/sectionRoutes";
import videoRouter from "./routers/videoRoutes";
import paymentRouter from "./routers/paymentRoutes";
import enrollmentRouter from "./routers/enrollmentRoutes";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/videos", videoRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/enrollments", enrollmentRouter);

app.listen(PORT, () => {
  console.log(`Server running on:${PORT}`);
});
