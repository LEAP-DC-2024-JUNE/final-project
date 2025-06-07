// import prisma from "../lib/prisma.js";

// export const getAllPayments = async (req, res) => {
//   try {
//     const payments = await prisma.payment.findMany({
//       include: { user: true, course: true },
//     });
//     res.json(payments);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch payments" });
//   }
// };

// export const getPaymentsByUser = async (req, res) => {
//   try {
//     const payments = await prisma.payment.findMany({
//       where: { userId: req.params.userId },
//       include: { course: true },
//     });

//     res.json(payments);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user payments" });
//   }
// };

// export const getPaymentsByCourse = async (req, res) => {
//   try {
//     const payments = await prisma.payment.findMany({
//       where: { courseId: req.params.courseId },
//       include: { user: true },
//     });
//     res.json(payments);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch course payments" });
//   }
// };

// export const createPayment = async (req, res) => {
//   try {
//     const { userId, courseId, amount, stripeId } = req.body;

//     if (!userId || !courseId || !amount || !stripeId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const payment = await prisma.payment.create({
//       data: { userId, courseId, amount, stripeId },
//     });

//     res.status(201).json(payment);
//   } catch (error) {
//     res.status(400).json({ error: "Failed to create payment" });
//   }
// };

import prisma from "../lib/prisma.js";

// Suragch (userId middlewarees irj bga)
export const createPayment = async (req, res) => {
  try {
    const { courseId, amount, stripeId } = req.body;
    const userId = req.user.id;

    if (!courseId || !amount || !stripeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Adilhan payment bga esehiig shalgaj bn
    const existing = await prisma.payment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Payment already exists for this course" });
    }

    const payment = await prisma.payment.create({
      data: { userId, courseId, amount, stripeId },
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin: buh paymentuudee avah
export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { id: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User: uursdiin paymentee avah
export const getPaymentsByUser = async (req, res) => {
  const { userId } = req.params;

  // Secure: Zuvkhun admin ymuu hereglegch uursdiin paymentee avch boloh
  if (req.user.role !== "ADMIN" && req.user.id !== userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true, price: true } },
      },
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Instructor/Admin: neg coursed hamaaraltai paymentuud avah
export const getPaymentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (req.user.role !== "ADMIN" && req.user.id !== course.instructorId) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to course payments" });
    }

    const payments = await prisma.payment.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching course payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
