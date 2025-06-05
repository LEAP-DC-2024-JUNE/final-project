import prisma from "../lib/prisma.js";

export const createEnrollmentWithPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, amount, stripeId } = req.body;

    if (!courseId || !amount || !stripeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if already enrolled
    const alreadyEnrolled = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (alreadyEnrolled) {
      return res.status(409).json({ error: "Already enrolled" });
    }

    // Start transaction
    const [payment, enrollment] = await prisma.$transaction([
      prisma.payment.create({
        data: { userId, courseId, amount, stripeId },
      }),
      prisma.enrollment.create({
        data: { userId, courseId },
      }),
    ]);

    res.status(201).json({ payment, enrollment });
  } catch (error) {
    console.error("Failed to create payment + enrollment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
