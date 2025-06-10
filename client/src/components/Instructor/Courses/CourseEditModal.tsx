"use client";

import FileUpload from "../Create-Course/FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Course } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onCourseUpdated?: (updatedCourse: Course) => void;
}

export const CourseEditModal = ({
  isOpen,
  onClose,
  course,
  onCourseUpdated,
}: EditCourseModalProps) => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (course) {
      setFormState({
        title: course.title,
        description: course.description,
        price: String(course.price),
        imageUrl: course.imageUrl,
      });
    }
  }, [course]);

  const updateFormField = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const token = await getToken({ template: "suraa" });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${course.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formState.title,
            description: formState.description,
            price: Number(formState.price),
            imageUrl: formState.imageUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      const updatedData = await response.json();
      onCourseUpdated?.({
        ...course,
        ...updatedData,
      });
      onClose();
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Edit Course
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Course Name *</Label>
            <Input
              value={formState.title}
              onChange={(e) => updateFormField("title", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label>Course Description *</Label>
            <Textarea
              value={formState.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label>Course Price ($) *</Label>
            <Input
              type="number"
              value={formState.price}
              onChange={(e) => updateFormField("price", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label>Course Image *</Label>
            <FileUpload
              setFormState={setFormState}
              initialImageUrl={formState.imageUrl}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
