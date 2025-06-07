"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface EnrolledCourse {
  id: string;
  course: {
    id: string;
    title: string;
    price: number;
  };
}

const MyEnrolledCourses = () => {
  const { getToken, userId } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userId) return;

      try {
        const token = await getToken({ template: "suraa" });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enrollments/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId, getToken]);

  // UI
  if (loading) return <p className="p-4">Loading your courses...</p>;

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (courses.length === 0)
    return <p className="p-4">You are not enrolled in any courses yet.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Enrolled Courses</h1>
      <ul className="space-y-4">
        {courses.map((enrollment) => (
          <li
            key={enrollment.id}
            className="border p-4 rounded shadow flex flex-col"
          >
            <span className="text-xl font-semibold">
              {enrollment.course.title}
            </span>
            <span className="text-gray-600">${enrollment.course.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyEnrolledCourses;
