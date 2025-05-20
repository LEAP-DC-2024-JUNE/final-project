import prisma from "../lib/prisma";

export const getSectionsByCourse = async (req, res) => {
  try {
    const sections = await prisma.section.findMany({
      where: { courseId: req.params.courseId },
      include: { videos: true },
    });

    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sections" });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const section = await prisma.section.findUnique({
      where: { id: req.params.id },
      include: { videos: true },
    });

    if (!section) return res.status(404).json({ error: "Section not found" });

    res.json(section);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch section" });
  }
};

export const createSection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Missing field" });

    const section = await prisma.section.create({
      data: { name, courseId: req.params.courseId },
    });

    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ error: "Failed to create section" });
  }
};

export const updateSection = async (req, res) => {
  try {
    const updatedSection = await prisma.section.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ error: "Failed to update section" });
  }
};

export const deleteSection = async (req, res) => {
  try {
    await prisma.section.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete section" });
  }
};
