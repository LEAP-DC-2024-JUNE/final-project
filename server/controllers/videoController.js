import prisma from "../lib/prisma.js";

export const getVideosBySection = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const videos = await prisma.video.findMany({
      where: { sectionId },
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

export const getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await prisma.video.findUnique({ where: { id } });

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
};

export const createVideo = async (req, res) => {
  const { sectionId } = req.params;
  const { title, url } = req.body;
  const { id: userId } = req.user;

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  try {
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        course: true,
      },
    });

    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    if (section.course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to add video to this section" });
    }

    const newVideo = await prisma.video.create({
      data: { title, url, sectionId },
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ error: "Failed to create video" });
  }
};

export const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const { id: userId } = req.user;

  try {
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (video.section.course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this video" });
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { title, url },
    });

    res.json(updatedVideo);
  } catch (error) {
    res.status(400).json({ error: "Failed to update video" });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (video.section.course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this video" });
    }

    await prisma.video.delete({ where: { id } });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete video" });
  }
};
