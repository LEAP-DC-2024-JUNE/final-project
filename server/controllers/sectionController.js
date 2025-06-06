// import prisma from "../lib/prisma.js";

// export const getSectionsByCourse = async (req, res) => {
//   try {
//     const sections = await prisma.section.findMany({
//       where: { courseId: req.params.courseId },
//       include: { videos: true },
//     });

//     res.json(sections);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch sections" });
//   }
// };

// export const getSectionById = async (req, res) => {
//   try {
//     const section = await prisma.section.findUnique({
//       where: { id: req.params.id },
//       include: { videos: true },
//     });

//     if (!section) return res.status(404).json({ error: "Section not found" });

//     res.json(section);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch section" });
//   }
// };

// export const createSection = async (req, res) => {
//   try {
//     const { name } = req.body;

//     if (!name) return res.status(400).json({ error: "Missing field" });

//     const section = await prisma.section.create({
//       data: { name, courseId: req.params.courseId },
//     });

//     res.status(201).json(section);
//   } catch (error) {
//     res.status(400).json({ error: "Failed to create section" });
//   }
// };

// export const updateSection = async (req, res) => {
//   try {
//     const updatedSection = await prisma.section.update({
//       where: { id: req.params.id },
//       data: req.body,
//     });

//     res.json(updatedSection);
//   } catch (error) {
//     res.status(400).json({ error: "Failed to update section" });
//   }
// };

// export const deleteSection = async (req, res) => {
//   try {
//     await prisma.section.delete({
//       where: { id: req.params.id },
//     });

//     res.status(200).json({ message: "Deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ error: "Failed to delete section" });
//   }
// };

import prisma from "../lib/prisma.js";

export const createSection = async (req, res) => {
  const { courseId } = req.params;
  const { name } = req.body;
  const { id: userId } = req.user;

  if (!name) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to create section for this course" });
    }

    const newSection = await prisma.section.create({
      data: {
        name,
        courseId,
      },
    });

    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ error: "Failed to create section" });
  }
};

export const getSectionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const sections = await prisma.section.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
};

export const updateSection = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const section = await prisma.section.findUnique({
      where: { id },
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
        .json({ error: "Unauthorized to update this section" });
    }

    const updatedSection = await prisma.section.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ error: "Failed to update section" });
  }
};

export const deleteSection = async (req, res) => {
  const { sectionId } = req.params;
  const { id: userId } = req.user;

  try {
    if (!sectionId) {
      return res.status(400).json({ error: "Section ID is required" });
    }

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    if (section.course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this section" });
    }

    await prisma.section.delete({ where: { id: sectionId } });

    res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Delete section error:", error);
    res.status(400).json({ error: "Failed to delete section" });
  }
};
