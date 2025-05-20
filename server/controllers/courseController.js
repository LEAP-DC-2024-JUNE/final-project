import prisma from "../lib/prisma";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,
        sections: {
          include: {
            videos: true,
          },
        },
      },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        sections: {
          include: {
            videos: true,
          },
        },
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, price, instructorId } = req.body;

    if (!title || !description || !price || !imageUrl || !instructorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCourse = await prisma.course.create({
      data: { title, description, price, imageUrl, instructorId },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to create course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete course" });
  }
};
