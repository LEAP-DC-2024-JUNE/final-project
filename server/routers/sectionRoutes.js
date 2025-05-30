// import express from "express";
// import {
//   deleteSection,
//   getSectionById,
//   updateSection,
// } from "../controllers/sectionController.js";
// import {
//   createVideo,
//   getVideosBySection,
// } from "../controllers/videoController.js";
// import {
//   authenticateUser,
//   authorizeRoles,
// } from "../middlewares/authMiddleware.js";

// const sectionRouter = express.Router();

// sectionRouter.get("/:id", authenticateUser, getSectionById);
// sectionRouter.patch(
//   "/:id",
//   authenticateUser,
//   authorizeRoles("INSTRUCTOR"),
//   updateSection
// );
// sectionRouter.delete(
//   "/:id",
//   authenticateUser,
//   authorizeRoles("INSTRUCTOR"),
//   deleteSection
// );

// sectionRouter.get("/:sectionId/videos", authenticateUser, getVideosBySection);
// sectionRouter.post(
//   "/:sectionId/videos",
//   authenticateUser,
//   authorizeRoles("INSTRUCTOR"),
//   createVideo
// );

// export default sectionRouter;

import express from "express";
import {
  createSection,
  getSectionsByCourse,
  updateSection,
  deleteSection,
} from "../controllers/sectionController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const sectionRouter = express.Router();

sectionRouter.get("/:courseId/sections", authenticateUser, getSectionsByCourse);

sectionRouter.post(
  "/:courseId/sections",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  createSection
);

sectionRouter.patch(
  "/sections/:sectionId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  updateSection
);

sectionRouter.delete(
  "/sections/:sectionId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  deleteSection
);

export default sectionRouter;
