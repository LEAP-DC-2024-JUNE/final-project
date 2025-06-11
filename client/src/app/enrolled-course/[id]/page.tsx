"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import VideoPlayer from "@/components/VideoPlayer"; // You'll build this
import { Course } from "@/utils/types";
import { EnrolledCourseAccordion } from "@/components/Student/EnrolledCourseAccordion";

const EnrolledCoursePage = () => {
  const { getToken } = useAuth();
  const params = useParams();
  const courseId = params.id as string;
  console.log(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getToken({ template: "suraa" });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/enrolled-course/${courseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch course data.");
        }

        const data = await res.json();
        setCourse(data);

        const firstVideoUrl = data.sections?.[0]?.videos?.[0]?.videoUrl || null;
        setCurrentVideoUrl(firstVideoUrl);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, getToken]);

  // UI
  if (loading) return <p className="p-4">Loading course...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!course) return <p className="p-4">Course not found</p>;

  return (
    <div className="p-8 flex flex-col gap-20">
      <div className="flex gap-20 items-center">
        <img
          src={course.imageUrl}
          alt="courseImage"
          width={360}
          className="rounded-3xl"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-6">{course.description}</p>
        </div>
      </div>

      <div className="flex gap-20  pt-8 pb-8 rounded-md">
        <EnrolledCourseAccordion
          currentVideoUrl={currentVideoUrl}
          sections={course.sections}
          onVideoSelect={(videoUrl: string) => setCurrentVideoUrl(videoUrl)}
        />
        {currentVideoUrl ? (
          <VideoPlayer videoUrl={currentVideoUrl} />
        ) : (
          <p className=" text-gray-500 w-[765px] h-[385px] text-center items-center">
            Select a video to start watching
          </p>
        )}
      </div>
    </div>
  );
};

export default EnrolledCoursePage;
