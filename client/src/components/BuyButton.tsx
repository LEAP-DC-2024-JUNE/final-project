"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createStripeSession } from "@/utils/stripe";

interface BuyButtonProps {
  courseId: string;
  title: string;
  amount: number;
}

export const BuyButton = ({ courseId, title, amount }: BuyButtonProps) => {
  const { getToken, userId } = useAuth();
  const router = useRouter();

  const handleBuyNow = async () => {
    if (!userId) {
      return router.push(
        `/sign-in?redirectUrl=/course/${courseId}&role=STUDENT`
      );
    }

    try {
      const token = await getToken({ template: "suraa" });

      const stripeUrl = await createStripeSession({
        courseId,
        title,
        amount,
        token: token!,
      });

      window.location.href = stripeUrl;
    } catch (err) {
      console.error("Stripe session error:", err);
    }
  };

  return (
    <button
      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md text-lg font-medium"
      onClick={handleBuyNow}
    >
      Buy now
    </button>
  );
};
