import express from "express";
export const courseRouter = express.Router();

courseRouter.get("/api/courses");
courseRouter.get("/api/courses/:id");
courseRouter.post("/api/courses");
courseRouter.patch("/api/courses/:id");
courseRouter.delete("/api/courses/:id");
