"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { EnrolledCourseCard } from "./EnrolledCourseCard";

interface EnrolledCourse {
  id: string;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
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

  if (loading) return <p className="p-4">Loading your courses...</p>;

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (courses.length === 0)
    return <p className="p-4">You are not enrolled in any courses yet.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <p className="text-gray-600 mb-8">
        All the courses you are currently enrolled in.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((enrollment) => (
          <EnrolledCourseCard
            key={enrollment.id}
            courseId={enrollment.course.id}
            title={enrollment.course.title}
            price={enrollment.course.price}
            imageUrl={enrollment.course.imageUrl}
            enrolledAt={enrollment.enrolledAt}
          />
        ))}
      </div>
    </div>
  );
};

export default MyEnrolledCourses;
