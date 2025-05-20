import prisma from "../lib/prisma";

export const getVideosBySection = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { sectionId: req.params.sectionId },
    });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newVideo = await prisma.video.create({
      data: { title, url, sectionId: req.params.sectionId },
    });

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(400).json({ error: "Failed to create video" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const updatedVideo = await prisma.video.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updatedVideo);
  } catch (error) {
    res.status(400).json({ error: "Failed to update video" });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    await prisma.video.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete video" });
  }
};
