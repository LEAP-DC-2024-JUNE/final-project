"use client";

import { Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

const DeleteCourseCard = ({ course, onDelete }: any) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${course.title}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("User not authenticated");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${course.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      onDelete(course.id);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // So, this clicking delete won't open the course
        handleDelete();
      }}
      disabled={loading}
      className="p-1 rounded hover:bg-red-100 hover:text-red-600 text-gray-500"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <X className="w-5 h-5" />
      )}
    </button>
  );
};

export default DeleteCourseCard;
