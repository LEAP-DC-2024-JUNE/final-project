"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";

export interface CourseFormState {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

export function CreateCourseModal1({ isOpen, onClose, onCourseCreated }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<CourseFormState>({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const { getToken } = useAuth();

  const updateFormField = (field: keyof CourseFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { title, description, price, imageUrl } = formState;

    if (!title || !description || !price || !imageUrl) {
      alert("Please fill in ALL required fields");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found. Please sign in again.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            price: Number(price),
            imageUrl,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create course");

      const data = await response.json();

      onCourseCreated(formState, data.id);
    } catch (error: any) {
      console.error("Error creating course:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Course
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              placeholder="Enter course name"
              value={formState.title}
              onChange={(e) => updateFormField("title", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="courseDescription">Course Description *</Label>
            <Textarea
              id="courseDescription"
              placeholder="Enter course description"
              value={formState.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coursePrice">Course Price ($) *</Label>
            <Input
              id="coursePrice"
              type="number"
              placeholder="Enter course price"
              value={formState.price}
              onChange={(e) => updateFormField("price", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="courseImage">Course Image *</Label>
            <FileUpload setFormState={setFormState} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
