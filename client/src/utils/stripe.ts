interface CreateStripeSessionParams {
  courseId: string;
  title: string;
  amount: number;
  token: string;
}

export const createStripeSession = async ({
  courseId,
  title,
  amount,
  token,
}: CreateStripeSessionParams): Promise<string> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, title, amount }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Stripe session creation failed");
  }

  const data = await res.json();
  return data.url; // Stripe Checkout URL
};
