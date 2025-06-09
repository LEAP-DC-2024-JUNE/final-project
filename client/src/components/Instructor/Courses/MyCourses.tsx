"use client";
import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { Course } from "@/utils/types";

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const handleRemoveCourse = (id: number) => {
    setCourses((prev) => prev.filter((course: any) => course.id !== id));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken({ template: "suraa" });

        if (!token) {
          throw new Error("No token found. Please sign in again.");
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/instructor/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className=" flex flex-col items-start justify-between mx-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-medium">Courses I own:</p>
        {loading ? (
          <p className="mt-10">Loading courses...</p>
        ) : (
          <div className="py-10 flex flex-row items-center gap-10 flex-wrap">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <CourseCard
                  key={index}
                  course={course}
                  onRemove={handleRemoveCourse}
                />
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyCourses;
