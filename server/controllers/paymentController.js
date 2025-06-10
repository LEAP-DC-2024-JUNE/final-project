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
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
// export const getPaymentsByUser = async (req, res) => {
//   const { userId } = req.params;

//   // Secure: Zuvkhun admin ymuu hereglegch uursdiin paymentee avch boloh
//   if (req.user.role !== "ADMIN" && req.user.id !== userId) {
//     return res.status(403).json({ error: "Unauthorized access" });
//   }

//   try {
//     const payments = await prisma.payment.findMany({
//       where: { userId },
//       include: {
//         course: { select: { id: true, title: true, price: true } },
//       },
//     });

//     res.status(200).json(payments);
//   } catch (error) {
//     console.error("Error fetching user payments:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getPaymentsByUser = async (req, res) => {
  const { userId: clerkId } = req.params;
  const userId = req.user.id;

  // Security check
  if (req.user.role !== "ADMIN" && req.user.clerkId !== clerkId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    // Fetch payments for this user
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    });

    // Enrich each payment with Stripe card info
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        try {
          const session = await stripe.checkout.sessions.retrieve(
            payment.stripeId
          );

          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent
          );

          let paymentMethodDetails = null;

          if (paymentIntent.latest_charge) {
            const charge = await stripe.charges.retrieve(
              paymentIntent.latest_charge
            );

            paymentMethodDetails = charge?.payment_method_details?.card;
          }
          return {
            id: payment.id,
            amount: payment.amount,
            stripeId: payment.stripeId,
            createdAt: payment.createdAt,
            course: {
              id: payment.course.id,
              title: payment.course.title,
            },
            instructorName: payment.course.instructor
              ? `${payment.course.instructor.email} `
              : "Unknown",
            card: paymentMethodDetails
              ? {
                  brand: paymentMethodDetails.brand,
                  last4: paymentMethodDetails.last4,
                  expMonth: paymentMethodDetails.exp_month,
                  expYear: paymentMethodDetails.exp_year,
                }
              : null,
          };
        } catch (err) {
          console.error(
            `Error retrieving Stripe session for payment ${payment.id}:`,
            err
          );

          // Return fallback in case Stripe call fails
          return {
            id: payment.id,
            amount: payment.amount,
            stripeId: payment.stripeId,
            createdAt: payment.createdAt,
            course: {
              id: payment.course.id,
              title: payment.course.title,
            },
            instructorName: payment.course.instructor
              ? `${payment.course.instructor.email} ${payment.course.instructor.phoneNumber}`
              : "Unknown",
            card: null,
          };
        }
      })
    );

    res.status(200).json(enrichedPayments);
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
