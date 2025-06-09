"use client";

import { useState } from "react";
import { Section } from "@/utils/types";

interface EnrolledCourseAccordionProps {
  sections: Section[];
  onVideoSelect: (videoUrl: string) => void;
  currentVideoUrl: string | null;
}

export const EnrolledCourseAccordion = ({
  sections,
  onVideoSelect,
  currentVideoUrl,
}: EnrolledCourseAccordionProps) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="space-y-4 ">
      {sections.map((section) => (
        <div key={section.id} className=" w-90">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full text-left px-4 py-3 bg-gray-50 font-semibold text-lg rounded-sm"
          >
            {section.name}
          </button>
          {openSectionId === section.id && (
            <div className="px-4 py-2 space-y-2">
              {section.videos.map((video) => {
                const isActive = video.url === currentVideoUrl;

                return (
                  <button
                    key={video.id}
                    onClick={() => onVideoSelect(video.url)}
                    className={`block w-full text-left px-2 py-1 rounded ${
                      isActive
                        ? " text-black font-semibold"
                        : "text-teal-600 hover:text-teal-800"
                    }`}
                  >
                    ▶ {video.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
