"use client";

import Image from "next/image";
import { Course } from "@/utils/types";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { CourseFooter } from "./CourseFooter";
import { CourseAccordion } from "./CourseAccordion";
import { useEffect, useRef, useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import { CourseEditModal } from "./CourseEditModal";
import { Button } from "@/components/ui/button";

export const CourseDetail = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { getToken, userId } = useAuth();
  const hasLoadedVideos = useRef(false);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const token = await getToken({ template: "suraa" });

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch course data.");
        }

        const data = await res.json();
        setCourse(data);
      } catch (error) {
        setError("An error occurred.");
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // useEffect(() => {
  //   if (!course || !course.sections?.length || hasLoadedVideos.current) return;

  //   const fetchVideosForAllSections = async () => {
  //     try {
  //       const token = await getToken({ template: "suraa" });

  //       const updatedSections = await Promise.all(
  //         course.sections.map(async (section) => {
  //           const res = await fetch(
  //             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videos/section/${section.id}`,
  //             {
  //               method: "GET",
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             }
  //           );

  //           const videos = res.ok ? await res.json() : [];
  //           return { ...section, videos };
  //         })
  //       );

  //       hasLoadedVideos.current = true;
  //       setCourse((prev) =>
  //         prev ? { ...prev, sections: updatedSections } : prev
  //       );
  //     } catch (err) {
  //       console.error("Error fetching videos by section:", err);
  //     }
  //   };

  //   fetchVideosForAllSections();
  // }, [course, getToken]);

  const handleVideoDeleted = (
    videoId: string | number,
    sectionId: string | number
  ) => {
    if (!course) return;

    const updatedSections = course.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          videos: section.videos.filter((video) => video.id !== videoId),
        };
      }
      return section;
    });

    setCourse({ ...course, sections: updatedSections });
  };

  const handleCourseUpdated = (updated: Partial<Course>) => {
    setCourse((prev) =>
      prev ? { ...prev, ...updated, instructor: prev.instructor } : prev
    );
  };

  const isInstructor = course?.instructor?.clerkId === userId;

  const handleGoBackButton = () => {
    router.push("/instructor/my-schools");
  };

  if (loading) return <p className="p-4">Loading course...</p>;
  if (!course) return <p className="p-4 text-red-500">Course not found.</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="">
      <div className="bg-[#eaf6f5] px-[84px] pt-8 pb-[84px] flex flex-col gap-4 relative">
        <Button
          variant="outline"
          className=" w-[80px]  my-5"
          onClick={handleGoBackButton}
        >
          Go Back
        </Button>

        <h2 className="text-3xl font-bold">{course.title}</h2>
        <p className="text-gray-700">{course.description}</p>
        {isInstructor && (
          <>
            <button
              className="absolute top-8 right-[84px] z-10 text-blue-600 border rounded-lg p-2 bg-white"
              onClick={() => setIsEditOpen(true)}
            >
              Edit Course
            </button>
            <CourseEditModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              course={course}
              onCourseUpdated={handleCourseUpdated}
            />
          </>
        )}
      </div>
      <div className="flex flex-row justify-between gap-10 py-8 px-[84px]">
        <div className="w-full">
          <h3 className="text-2xl font-semibold mb-4">Course content</h3>
          <p className="text-sm mb-4 text-gray-600">
            {course.sections?.length ?? 0} sections |{" "}
            {course.sections?.reduce(
              (acc, section) => acc + (section.videos?.length ?? 0),
              0
            ) ?? 0}
            lessons
          </p>
          <CourseAccordion
            sections={course.sections}
            onVideoDeleted={handleVideoDeleted}
            isInstructor={isInstructor}
          />
        </div>
        <div className="w-2/3">
          <div className="bg-white shadow rounded-md p-4 border flex flex-col gap-4">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="border border-black rounded-md px-4 py-4 flex items-center gap-3">
              <span className="text-xl font-semibold">${course.price}</span>
              <span className="text-sm text-gray-500">One-time purchase</span>
            </div>
            {isInstructor ? (
              <p>You are instructor of this course</p>
            ) : (
              <BuyButton
                courseId={course.id}
                title={course.title}
                amount={course.price}
              />
            )}
          </div>
        </div>
      </div>
      <CourseFooter />
    </div>
  );
};
