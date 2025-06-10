"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const sessionId = searchParams.get("session_id");
  const courseId = params.id as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const confirmEnrollment = async () => {
      if (!sessionId || !courseId) {
        setStatus("error");
        return;
      }

      try {
        const token = await getToken({ template: "suraa" });

        const stripeSessionRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/session?session_id=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!stripeSessionRes.ok) {
          throw new Error("Failed to retrieve Stripe session");
        }

        const stripeSession = await stripeSessionRes.json();

        const amount = stripeSession.amount_total / 100;
        console.log(stripeSession);
        if (!amount) throw new Error("Missing amount_total in Stripe session");

        const enrollRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments/with-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              courseId,
              amount,
              stripeId: sessionId,
            }),
          }
        );

        if (!enrollRes.ok) {
          throw new Error("Enrollment failed");
        }

        setStatus("success");
      } catch (error) {
        console.error("Enrollment error:", error);
        setStatus("error");
      }
    };

    confirmEnrollment();
  }, [sessionId, courseId, getToken]);

  if (status === "loading") {
    return <p className="p-4 text-lg">Finalizing your enrollment...</p>;
  }

  if (status === "success") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Enrollment Successful!</h1>
        <p className="text-lg mb-6">You can now access your course.</p>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded"
          onClick={() => router.push("/student/dashboard")}
        >
          Go to Course
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-red-600">
      <h1 className="text-3xl font-bold mb-4"> Enrollment Failed</h1>
      <p className="text-lg mb-6">
        Something went wrong. Please contact support.
      </p>
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
        onClick={() => router.push(`/course/${courseId}`)}
      >
        Back to Course
      </button>
    </div>
  );
};

export default SuccessPage;
