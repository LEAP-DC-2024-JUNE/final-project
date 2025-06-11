"use client";
import * as motion from "motion/react-client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check, File, Upload } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast, Toaster } from "sonner";
import VideoItemInput from "@/components/Buttons/VideoItemInput";

interface CourseSectionProps {
  formState: any;
  courseId: string;
}

interface VideoItem {
  id: number;
  title: string;
  url?: string;
  serverId?: string;
}

interface SectionItem {
  id: number;
  name: string;
  videos: VideoItem[];
  serverId?: string;
}

export default function CourseSection({
  formState,
  courseId,
}: CourseSectionProps) {
  const [sections, setSections] = useState<SectionItem[]>([
    { id: Date.now(), name: "", videos: [] },
  ]);
  const [savedSectionIds, setSavedSectionIds] = useState<Set<number>>(
    new Set()
  );
  const [savedVideoIds, setSavedVideoIds] = useState<Set<number>>(new Set());

  const { getToken } = useAuth();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "leapdc-preset");
    const CLOUD_NAME = "dd3imxxlm";
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message || "Upload failed");

    return data.secure_url;
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now(), name: "", videos: [] }]);
  };

  const deleteSection = (sectionId: number) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const deleteSectionFromServer = async (serverId: string) => {
    const section = sections.find((s) => s.serverId === serverId);
    if (!section) {
      toast.error("Section not found");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete this ${section.name}?`
    );

    if (!isConfirmed) return;

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/${serverId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete section");
      }

      setSections((prev) => prev.filter((s) => s.serverId !== serverId));
      setSavedSectionIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(section.id);
        return newSet;
      });

      toast.success("Section deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete section");
    }
  };

  const updateSectionName = (sectionId: number, newName: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, name: newName } : section
      )
    );
  };

  const addVideo = (sectionId: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              videos: [...section.videos, { id: Date.now(), title: "" }],
            }
          : section
      )
    );
  };

  const deleteVideo = (sectionId: number, videoId: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              videos: section.videos.filter((v) => v.id !== videoId),
            }
          : section
      )
    );
  };

  const updateVideoTitle = (
    sectionId: number,
    videoId: number,
    newTitle: string
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              videos: section.videos.map((v) =>
                v.id === videoId ? { ...v, title: newTitle } : v
              ),
            }
          : section
      )
    );
  };

  const handleVideoUpload = async (
    sectionId: number,
    videoId: number,
    file: File
  ) => {
    try {
      toast("Uploading video...");
      const url = await uploadToCloudinary(file);
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                videos: section.videos.map((v) =>
                  v.id === videoId ? { ...v, url } : v
                ),
              }
            : section
        )
      );
      toast.success("Video uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
  };

  const saveSectionToServer = async (sectionId: number, name: string) => {
    if (savedSectionIds.has(sectionId)) {
      toast(`Section "${name}" already saved.`);
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a section name");
      return;
    }

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseId}/sections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? { ...section, serverId: data.id || data.sectionId || data._id }
            : section
        )
      );

      setSavedSectionIds((prev) => new Set(prev).add(sectionId));
      toast.success(`Section "${name}" saved.`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const saveVideoToServer = async (
    videoId: number,
    sectionId: number,
    title: string,
    url: string
  ) => {
    if (savedVideoIds.has(videoId)) {
      toast(`Video "${title}" already saved.`);
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    if (!url) {
      toast.error("Please upload a video first");
      return;
    }

    const section = sections.find((s) => s.id === sectionId);
    if (!section?.serverId) {
      toast.error("Please save the section first before adding videos");
      return;
    }

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videos/section/${section.serverId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, url }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setSections((prev) =>
        prev.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                videos: sec.videos.map((v) =>
                  v.id === videoId
                    ? { ...v, serverId: data.id || data.videoId || data._id }
                    : v
                ),
              }
            : sec
        )
      );

      setSavedVideoIds((prev) => new Set(prev).add(videoId));
      toast.success(`Video "${title}" saved.`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const deleteVideoFromServer = async (
    videoId: number,
    sectionId: number,
    videoTitle: string
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    const video = section?.videos.find((v) => v.id === videoId);

    if (!video?.serverId) {
      toast.error("Video not found on server");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete this video: "${videoTitle}"?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videos/${video.serverId}`,
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

      deleteVideo(sectionId, videoId);

      setSavedVideoIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });

      toast.success(`Video "${videoTitle}" deleted successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete video");
    }
  };

  return (
    <div>
      <div className="py-4 w-[1000px]">
        <div className="flex items-center justify-between gap-24 py-4">
          <h3 className="text-[16px]">
            Course Sections for
            <span className="text-[20px] font-bold pl-2">
              {formState.title}
            </span>
          </h3>
          <Button onClick={addSection} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
        </div>

        <Accordion type="multiple" className="w-full bg-zinc-50 px-8">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={`section-${section.id}`}>
              <div className="flex items-center justify-between">
                <AccordionTrigger className="flex-1">
                  <Input
                    value={section.name}
                    onChange={(e) =>
                      updateSectionName(section.id, e.target.value)
                    }
                    placeholder="Section title"
                    className="w-[200px] mr-2"
                  />
                </AccordionTrigger>

                <div className="flex gap-4 items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check
                      size={30}
                      onClick={() =>
                        saveSectionToServer(section.id, section.name)
                      }
                      className="cursor-pointer hover:bg-zinc-400 rounded p-1"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2
                      size={30}
                      onClick={() => {
                        if (section.serverId) {
                          deleteSectionFromServer(section.serverId);
                        } else {
                          deleteSection(section.id);
                        }
                      }}
                      className="cursor-pointer hover:bg-zinc-400 rounded p-1"
                    />
                  </motion.div>
                </div>
              </div>

              <AccordionContent>
                <div className="px-[150px] space-y-10">
                  {section.videos.map((video) => (
                    <VideoItemInput
                      key={video.id}
                      sectionId={section.id}
                      video={video}
                      updateVideoTitle={updateVideoTitle}
                      handleVideoUpload={handleVideoUpload}
                      saveVideoToServer={saveVideoToServer}
                      deleteVideo={deleteVideo}
                      deleteVideoFromServer={deleteVideoFromServer}
                      allSectionsComplete={
                        sections.every((section) => section.serverId) &&
                        sections.every((section) =>
                          section.videos.every((video) => video.url)
                        )
                      }
                    />
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addVideo(section.id)}
                    className="cursor-pointer hover:bg-zinc-300"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Video
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {/* <Toaster position="top-right" /> */}
      {/* Go back to courses button */}
      <div className="flex justify-center mt-8 pt-4 border-t">
        <Button
          onClick={() => window.history.back()}
          disabled={
            sections.length === 0 ||
            !sections.every((section) => section.serverId) ||
            !sections.every((section) =>
              section.videos.every((video) => video.url && video.serverId)
            )
          }
          className="px-8 py-2 cursor-pointer"
        >
          Section is created - Go back to courses
        </Button>
      </div>
    </div>
  );
}
