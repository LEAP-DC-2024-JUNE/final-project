import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/courseController.js";
import {
  createSection,
  getSectionsByCourse,
} from "../controllers/sectionController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const courseRouter = express.Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getCourseById);

courseRouter.post(
  "/",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  createCourse
);
courseRouter.patch(
  "/:id",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  updateCourse
);
courseRouter.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  deleteCourse
);

courseRouter.get("/:courseId/sections", authenticateUser, getSectionsByCourse);
courseRouter.post(
  "/:courseId/sections",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  createSection
);

export default courseRouter;
