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
import { Plus, Trash2, Check, File, Upload, SquarePen } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface CourseSectionProps {
  formState: any;
  courseId: string;
}

interface VideoItem {
  id: number;
  title: string;
}

interface SectionItem {
  id: number;
  name: string;
  videos: VideoItem[];
}

export default function CourseSection({
  formState,
  courseId,
}: CourseSectionProps) {
  const { getToken } = useAuth();

  const [sections, setSections] = useState<SectionItem[]>([
    { id: Date.now(), name: "", videos: [] },
  ]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), name: "", videos: [] }]);
  };

  const deleteSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const updateSectionName = (sectionId: number, newName: string) => {
    const updated = sections.map((section) =>
      section.id === sectionId ? { ...section, name: newName } : section
    );
    setSections(updated);
  };

  const addVideo = (sectionId: number) => {
    const updated = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            videos: [...section.videos, { id: Date.now(), title: "" }],
          }
        : section
    );
    setSections(updated);
  };

  const deleteVideo = (sectionId: number, videoId: number) => {
    const updated = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            videos: section.videos.filter((video) => video.id !== videoId),
          }
        : section
    );
    setSections(updated);
  };

  const updateVideoTitle = (
    sectionId: number,
    videoId: number,
    newTitle: string
  ) => {
    const updated = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            videos: section.videos.map((video) =>
              video.id === videoId ? { ...video, title: newTitle } : video
            ),
          }
        : section
    );
    setSections(updated);
  };

  const saveSectionToServer = async (name: string) => {
    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found");

      const response = await fetch(
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save");
      console.log("Saved:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-[365px] ">
      <div className="grid gap-6 py-4 h-[570px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Course Sections for</h3>
            <Button onClick={addSection} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Section
            </Button>
          </div>

          <Accordion type="multiple" className="w-full bg-zinc-100">
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
                      className="max-w-[200px] mr-2"
                    />
                  </AccordionTrigger>

                  <div className="flex gap-3 items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check
                        size={30}
                        onClick={() => saveSectionToServer(section.name)}
                        className="cursor-pointer hover:bg-zinc-400 rounded p-1"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SquarePen
                        size={30}
                        className="cursor-pointer hover:bg-zinc-400 rounded p-1"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2
                        size={30}
                        onClick={() => deleteSection(section.id)}
                        className="cursor-pointer hover:bg-zinc-400 rounded p-1"
                      />
                    </motion.div>
                  </div>
                </div>

                <AccordionContent>
                  <div className="pl-6 space-y-3">
                    {section.videos.map((video) => (
                      <div key={video.id} className="flex gap-2 items-center">
                        <File className="h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Video title"
                          value={video.title}
                          onChange={(e) =>
                            updateVideoTitle(
                              section.id,
                              video.id,
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <div className="relative">
                          <Input
                            type="file"
                            accept="video/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-1 cursor-pointer" />
                            Upload
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVideo(section.id, video.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addVideo(section.id)}
                      className=" cursor-pointer hover:bg-zinc-300"
                    >
                      <Plus className="h-4 w-4 mr-1 " />
                      Add Video
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-between gap-2 mt-auto">
          <Button type="button" className="bg-zinc-400 text-white">
            Create Course
          </Button>
        </div>
      </div>
    </div>
  );
}
