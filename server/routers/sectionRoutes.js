import express from "express";
import {
  deleteSection,
  getSectionById,
  updateSection,
} from "../controllers/sectionController.js";
import {
  createVideo,
  getVideosBySection,
} from "../controllers/videoController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const sectionRouter = express.Router();

sectionRouter.get("/:id", authenticateUser, getSectionById);
sectionRouter.patch(
  "/:id",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  updateSection
);
sectionRouter.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  deleteSection
);

sectionRouter.get("/:sectionId/videos", authenticateUser, getVideosBySection);
sectionRouter.post(
  "/:sectionId/videos",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  createVideo
);

export default sectionRouter;
