// import express from "express";
// import {
//   deleteVideo,
//   getVideoById,
//   updateVideo,
// } from "../controllers/videoController.js";
// import {
//   authenticateUser,
//   authorizeRoles,
// } from "../middlewares/authMiddleware.js";

// const videoRouter = express.Router();

// videoRouter.get("/:id", authenticateUser, getVideoById);
// videoRouter.patch(
//   "/:id",
//   authenticateUser,
//   authorizeRoles("INSTRUCTOR"),
//   updateVideo
// );
// videoRouter.delete(
//   "/:id",
//   authenticateUser,
//   authorizeRoles("INSTRUCTOR"),
//   deleteVideo
// );

// export default videoRouter;
import express from "express";
import {
  getVideosBySection,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const videoRouter = express.Router();

videoRouter.get("/section/:sectionId", authenticateUser, getVideosBySection);

videoRouter.get("/:id", authenticateUser, getVideoById);

videoRouter.post(
  "/section/:sectionId",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  createVideo
);

videoRouter.patch(
  "/:id",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  updateVideo
);

videoRouter.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("INSTRUCTOR"),
  deleteVideo
);

export default videoRouter;
