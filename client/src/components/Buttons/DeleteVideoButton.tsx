"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

type DeleteButtonProps = {
  videoId: string | number;
  videoTitle: string;
  onDeleteSuccess?: () => void;
};

const DeleteButton = ({
  videoId,
  videoTitle,
  onDeleteSuccess,
}: DeleteButtonProps) => {
  const { getToken } = useAuth();

  const deleteVideoFromServer = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${videoTitle}"?`
    );
    if (!isConfirmed) return;

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videos/${videoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete video");
      }

      toast.success(`Video "${videoTitle}" deleted successfully`);
      onDeleteSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete video");
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Trash2
        size={24}
        className="cursor-pointer hover:bg-red-100 hover:text-red-600 rounded p-1 text-gray-500"
        onClick={deleteVideoFromServer}
      />
    </motion.div>
  );
};

export default DeleteButton;
