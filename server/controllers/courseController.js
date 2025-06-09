import prisma from "../lib/prisma.js";
import { getAuth } from "@clerk/express";
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

export const getCourseByEnrollment = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  console.log(courseId);

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });

  if (!enrollment) {
    return res
      .status(403)
      .json({ error: "You are not enrolled in this course" });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: {
          videos: true,
        },
      },
    },
  });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  res.status(200).json(course);
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        sections: {
          include: {
            videos: true,
          },
        },
        enrollments: true,
        payments: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getCoursesByInstructor = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized: Missing Clerk ID" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: dbUser.id },
      include: {
        sections: true,
        enrollments: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching instructor's courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};
export const createCourse = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { title, description, price, imageUrl } = req.body;

    if (!clerkId || !title || !description || !price || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        instructorId: dbUser.id,
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.instructorId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this course" });
    }

    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete course" });
  }
};
