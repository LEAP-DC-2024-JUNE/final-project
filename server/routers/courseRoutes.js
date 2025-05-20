import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/courseController";
import {
  createSection,
  getSectionsByCourse,
} from "../controllers/sectionController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";

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
