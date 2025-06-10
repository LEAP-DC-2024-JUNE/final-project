"use client";

import { motion } from "framer-motion";
import { Edit2Icon, Trash2 } from "lucide-react";
import { Section } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DeleteButton from "@/components/Buttons/DeleteVideoButton";
import CourseEditInput from "./CourseEditInput";
import { useState } from "react";

type CourseAccordionProps = {
  sections: Section[];
  onVideoDeleted?: (
    videoId: string | number,
    sectionId: string | number
  ) => void;
  isInstructor?: boolean;
};

export const CourseAccordion = ({
  sections,
  onVideoDeleted,
  isInstructor,
}: CourseAccordionProps) => {
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [localSections, setLocalSections] = useState<Section[]>(sections);

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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
