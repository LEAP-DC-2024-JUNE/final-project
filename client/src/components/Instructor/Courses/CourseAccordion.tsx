"use client";
import { File, Upload, Check, Trash2, Edit2Icon } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { toast, Toaster } from "sonner";
import { Section } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DeleteButton from "@/components/Buttons/DeleteVideoButton";
import CourseEditInput from "./CourseEditInput";
import { useEffect, useState } from "react";

type CourseAccordionProps = {
  sections: Section[];
  onVideoDeleted?: (
    videoId: string | number,
    sectionId: string | number
  ) => void;
  onVideoAdded?: (
    sectionId: string | number,
    video: { title: string; url: string }
  ) => void;
  isInstructor?: boolean;
};

export const CourseAccordion = ({
  sections,
  onVideoDeleted,
  onVideoAdded,
  isInstructor,
}: CourseAccordionProps) => {
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [localSections, setLocalSections] = useState<Section[]>(sections);
  const [showInputForSectionId, setShowInputForSectionId] = useState<
    string | null
  >(null);

  const [newVideo, setNewVideo] = useState<{
    file: File | null;
    title: string;
    url: string;
  }>({
    file: null,
    title: "",
    url: "",
  });

  const { getToken } = useAuth();

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const handleEditClick = (videoId: string) => {
    setEditingVideoId((prev) => (prev === videoId ? null : videoId));
  };

  const handleSave = (updatedVideo: {
    id: string;
    title: string;
    url: string;
  }) => {
    setLocalSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        videos: section.videos.map((video) =>
          video.id === updatedVideo.id ? updatedVideo : video
        ),
      }))
    );
    setEditingVideoId(null);
  };

  const resetNewVideoForm = () => {
    setNewVideo({
      file: null,
      title: "",
      url: "",
    });
    setShowInputForSectionId(null);
  };

  const handleVideoUpload = async (sectionId: string) => {
    if (!newVideo.file) {
      toast.error("Please select a video file first");
      return;
    }

    if (!newVideo.title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    try {
      toast.loading("Uploading video...");

      const formData = new FormData();
      formData.append("file", newVideo.file);
      formData.append("upload_preset", "leapdc-preset");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dd3imxxlm/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      toast.dismiss();
      toast.success("Video uploaded successfully!");

      onVideoAdded?.(sectionId, {
        title: newVideo.title,
        url: data.secure_url,
      });

      setLocalSections((prevSections) =>
        prevSections.map((section) =>
          section.id.toString() === sectionId
            ? {
                ...section,
                videos: [
                  ...section.videos,
                  {
                    id: `temp-${Date.now()}`,
                    title: newVideo.title,
                    url: data.secure_url,
                  },
                ],
              }
            : section
        )
      );

      resetNewVideoForm();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Upload failed");
    }
  };

  return (
    <Accordion type="multiple" className="w-full flex flex-col gap-2">
      {localSections.map((section) => (
        <AccordionItem key={section.id} value={section.id.toString()}>
          <AccordionTrigger className="text-base font-semibold border rounded-md p-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-orange-500">{section.name}</p>
              <span className="ml-2 text-sm text-gray-500">
                ({section.videos.length} lesson
                {section.videos.length !== 1 ? "s" : ""})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-4">
            {section.videos.length === 0 && (
              <div className="py-2 text-sm text-gray-500">No videos yet</div>
            )}

            {section.videos.map((video, idx) => (
              <div key={video.id} className="py-2 text-gray-700 text-sm">
                {editingVideoId === video.id ? (
                  <CourseEditInput
                    videoId={video.id}
                    initialTitle={video.title}
                    initialUrl={video.url}
                    onSave={handleSave}
                    onDelete={() => {
                      setEditingVideoId(null);
                      onVideoDeleted?.(video.id, section.id);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg">
                        {idx + 1}. {video.title}
                      </span>
                      {isInstructor ? (
                        video.url && (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-orange-600 hover:underline ml-4 text-xs"
                          >
                            Preview
                          </a>
                        )
                      ) : (
                        <span className="ml-4 text-xs text-gray-500 italic">
                          Purchase this course to access the lesson
                        </span>
                      )}
                    </div>
                    {isInstructor && (
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit2Icon
                            size={24}
                            onClick={() => handleEditClick(video.id)}
                            className="cursor-pointer hover:bg-zinc-100 hover:text-zinc-600 rounded p-1 text-gray-500"
                          />
                        </motion.div>
                        <DeleteButton
                          videoId={video.id}
                          videoTitle={video.title}
                          onDeleteSuccess={() => {
                            onVideoDeleted?.(video.id, section.id);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isInstructor && (
              <div className="py-2">
                <button
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={() =>
                    setShowInputForSectionId((prev) =>
                      prev === section.id.toString()
                        ? null
                        : section.id.toString()
                    )
                  }
                >
                  + Add Video
                </button>

                {showInputForSectionId === section.id.toString() && (
                  <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
                    <File className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Video title"
                      value={newVideo.title}
                      onChange={(e) =>
                        setNewVideo((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewVideo((prev) => ({
                              ...prev,
                              file: file,
                            }));
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="text-sm px-2 py-1 border rounded flex items-center gap-1"
                      >
                        <Upload className="h-4 w-4" />
                        {newVideo.file ? newVideo.file.name : "Upload"}
                      </button>
                    </div>

                    {newVideo.url && (
                      <a
                        href={newVideo.url}
                        target="_blank"
                        className="text-orange-500 text-sm underline ml-1"
                        rel="noreferrer"
                      >
                        Preview Video
                      </a>
                    )}

                    <div className="flex gap-4 items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Check
                          size={30}
                          onClick={() =>
                            handleVideoUpload(section.id.toString())
                          }
                          className={`cursor-pointer rounded p-1 ${
                            newVideo.file && newVideo.title.trim()
                              ? "hover:bg-zinc-400 text-green-600"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          style={{
                            opacity:
                              newVideo.file && newVideo.title.trim() ? 1 : 0.5,
                          }}
                        />
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2
                          size={30}
                          onClick={resetNewVideoForm}
                          className="cursor-pointer hover:bg-zinc-400 rounded p-1"
                        />
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
