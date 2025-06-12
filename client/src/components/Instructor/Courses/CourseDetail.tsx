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
import { toast } from "sonner";
import { AddSectionModal } from "./AddSectionModal";

export const CourseDetail = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

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

  const addSection = async (sectionName: string) => {
    if (!sectionName.trim()) return;

    try {
      const token = await getToken({ template: "suraa" });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${course?.id}/sections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: sectionName,
            courseId: course?.id,
          }),
        }
      );
      console.log("Adding section:", {
        name: sectionName,
        courseId: course?.id,
      });

      if (!res.ok) {
        throw new Error("Failed to add section");
      }

      const newSection = await res.json();

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              sections: [...prev.sections, { ...newSection, videos: [] }],
            }
          : prev
      );

      toast.success("Section added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add section.");
    }
  };

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-lg font-medium">Loading course...</p>
      </div>
    );
  if (!course) return <p className="p-4 text-red-500">Course not found.</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="">
      <div className="bg-teal-500 px-[84px] pt-8 pb-[84px] flex flex-col gap-4 relative">
        {isInstructor && (
          <button
            className="border rounded-lg text-black bg-teal-100 p-2 w-[100px] cursor-pointer hover:bg-teal-200 text-sm"
            onClick={handleGoBackButton}
          >
            ← Go Back
          </button>
        )}

        <h2 className="text-3xl font-bold">{course.title}</h2>
        <p className="text-gray-800">{course.description}</p>
        {isInstructor && (
          <>
            <button
              className="absolute top-8 right-[84px] z-10 text-black border rounded-lg p-2 bg-teal-100 cursor-pointer  hover:bg-teal-200 text-sm"
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
          {isInstructor && (
            <div className="mt-4 ml-4">
              <button
                className="hover:underline text-blue-600"
                onClick={() => setIsAddSectionOpen(true)}
              >
                + Add Section
              </button>
            </div>
          )}
          <AddSectionModal
            isOpen={isAddSectionOpen}
            onClose={() => setIsAddSectionOpen(false)}
            onAddSection={addSection}
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
            {/* {isInstructor ? (
              <p>You are instructor of this course</p>
            ) : (
              <BuyButton
                courseId={course.id}
                title={course.title}
                amount={course.price}
              />
            )} */}
            {isInstructor ? (
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">
                  Share this link to sell your course:
                </p>
                <div className="flex items-center border rounded-md p-2 bg-gray-100">
                  <span className="truncate text-sm">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}`}
                  </span>
                  <Button
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/course/${course.id}`;
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
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
