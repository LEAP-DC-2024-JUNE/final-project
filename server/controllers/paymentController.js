import prisma from "../lib/prisma.js";

export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { user: true, course: true },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.params.userId },
      include: { course: true },
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user payments" });
  }
};

export const getPaymentsByCourse = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { courseId: req.params.courseId },
      include: { user: true },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course payments" });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { userId, courseId, amount, stripeId } = req.body;

    if (!userId || !courseId || !amount || !stripeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payment = await prisma.payment.create({
      data: { userId, courseId, amount, stripeId },
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: "Failed to create payment" });
  }
};
