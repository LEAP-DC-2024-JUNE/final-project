import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const userId = req.user.id;

  const { courseId, title, amount } = req.body;

  if (!courseId || !title || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: title },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}`,
      metadata: { userId, courseId },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};

// export const getStripeSession = async (req, res) => {
//   const sessionId = req.query.session_id;

//   if (!sessionId) {
//     return res.status(400).json({ error: "Missing session_id" });
//   }

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     res.status(200).json({
//       amount_total: session.amount_total,
//     });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

export const getStripeSession = async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.charges"],
    });

    const paymentIntent = session.payment_intent;
    const charge = paymentIntent?.charges?.data?.[0];
    const paymentMethodDetails = charge?.payment_method_details?.card;
    console.log(paymentMethodDetails);

    res.status(200).json({
      amount_total: session.amount_total,
      card: paymentMethodDetails
        ? {
            brand: paymentMethodDetails.brand,
            last4: paymentMethodDetails.last4,
            expMonth: paymentMethodDetails.exp_month,
            expYear: paymentMethodDetails.exp_year,
          }
        : null,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: error.message });
  }
};
