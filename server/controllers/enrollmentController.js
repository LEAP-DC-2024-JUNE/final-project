// import prisma from "../lib/prisma.js";

// export const getAllEnrollments = async (req, res) => {
//   try {
//     const enrollments = await prisma.enrollment.findMany({
//       include: { user: true, course: true },
//     });
//     res.json(enrollments);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch enrollments" });
//   }
// };

// export const getEnrollmentsByUser = async (req, res) => {
//   try {
//     const enrollments = await prisma.enrollment.findMany({
//       where: { userId: req.params.userId },
//       include: { course: true },
//     });
//     res.json(enrollments);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch user enrollments" });
//   }
// };

// export const getEnrollmentsByCourse = async (req, res) => {
//   try {
//     const enrollments = await prisma.enrollment.findMany({
//       where: { courseId: req.params.courseId },
//       include: { course: true },
//     });
//     res.json(enrollments);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch course enrollments" });
//   }
// };

// export const createEnrollment = async (req, res) => {
//   try {
//     const { userId, courseId } = req.body;

//     if (!userId || !courseId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const enrollment = await prisma.enrollment.create({
//       data: { userId, courseId },
//     });
//     res.status(201).json(enrollment);
//   } catch {
//     res.status(400).json({ error: "Failed to create enrollment" });
//   }
// };

import prisma from "../lib/prisma.js";

//  Admin/Instructor: bvh enrollmontuudaa harah
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching all enrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User: uurinhuu enrollmentuudaa harah
export const getEnrollmentsByUser = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "ADMIN" && req.user.id !== userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true, price: true } },
      },
    });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  Instructor: uuriin uusgesen coursiinhaa enrollmontuudaa harah
export const getEnrollmentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (req.user.role !== "ADMIN" && req.user.id !== course.instructorId) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to course enrollments" });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching course enrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// shineer enrollment uusgeh (user)
export const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ error: "Missing required courseId" });
    }

    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "User already enrolled in this course" });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
