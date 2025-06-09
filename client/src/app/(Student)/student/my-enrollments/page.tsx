"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { EnrollmentTable } from "@/components/Student/EnrollmentTable";

interface Payment {
  id: string;
  amount: number;
  stripeId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
  };
  instructorName?: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

const MyEnrollmentsPage = () => {
  const { getToken, userId } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId) return;

      try {
        const token = await getToken({ template: "suraa" });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await res.json();
        setPayments(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId, getToken]);

  if (loading) return <p className="p-4">Loading your enrollments...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Enrollments</h1>
      <p className="text-gray-600 mb-8">
        Here you can find all your enrollment & payment history.
      </p>
      <EnrollmentTable payments={payments} />
    </div>
  );
};

export default MyEnrollmentsPage;
