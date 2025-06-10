"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File, Upload, Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import * as motion from "motion/react-client";
import { toast } from "sonner";

type Props = {
  videoId: string;
  initialTitle: string;
  initialUrl: string;
  onSave: (updatedVideo: { id: string; title: string; url: string }) => void;
  onDelete: () => void;
};

const CourseEditInput = ({
  videoId,
  initialTitle,
  initialUrl,
  onSave,
  onDelete,
}: Props) => {
  const { getToken } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const hasChanges = title !== initialTitle || videoFile !== null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const tempUrl = URL.createObjectURL(file);
      setVideoUrl(tempUrl);
    }
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      setIsSaving(true);

      let uploadedUrl = videoUrl;

      if (videoFile) {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("upload_preset", "leapdc-preset");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dd3imxxlm/video/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        uploadedUrl = data.secure_url;

        setIsUploading(false);
      }

      const token = await getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videos/${videoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, url: uploadedUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update video");
      }

      const updatedVideo = await response.json();
      onSave(updatedVideo);
      toast.success("Section updated successfully");
    } catch (err) {
      console.error("Failed to save:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
      setVideoFile(null); // Clear uploaded file after saving
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <Input
        placeholder="Video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />

      <div className="relative">
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Button type="button" variant="outline" size="sm" disabled={isSaving}>
          <Upload className="h-4 w-4 mr-1" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          className="text-orange-500 text-sm underline ml-1"
          rel="noreferrer"
        >
          Preview Video
        </a>
      )}

      <div className="flex gap-4 items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`p-1 rounded ${
              isSaving || !hasChanges
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-zinc-400"
            }`}
          >
            <Check size={24} />
          </button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Trash2
            size={30}
            onClick={onDelete}
            className="cursor-pointer hover:bg-zinc-400 rounded p-1"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CourseEditInput;
