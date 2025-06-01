"use client";

import { Course } from "@/utils/types";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const CourseDetail = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;
  const { getToken } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const token = await getToken({ template: "suraa" });

        if (!token) {
          throw new Error("No token found. Please sign in again.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p className="p-4">Loading course...</p>;
  if (!course) return <p className="p-4 text-red-500">Course not found.</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full max-w-xl rounded mb-6"
      />
      <p className="mb-4 text-lg">{course.description}</p>
      <p className="text-xl font-semibold">${course.price}</p>
      <p>TEST</p>
    </div>
  );
};
