import prisma from "../lib/prisma.js";

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { user: true, course: true },
    });
    res.json(enrollments);
  } catch {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

export const getEnrollmentsByUser = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.params.userId },
      include: { course: true },
    });
    res.json(enrollments);
  } catch {
    res.status(500).json({ error: "Failed to fetch user enrollments" });
  }
};

export const getEnrollmentsByCourse = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: req.params.courseId },
      include: { course: true },
    });
    res.json(enrollments);
  } catch {
    res.status(500).json({ error: "Failed to fetch course enrollments" });
  }
};

export const createEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
    });
    res.status(201).json(enrollment);
  } catch {
    res.status(400).json({ error: "Failed to create enrollment" });
  }
};
