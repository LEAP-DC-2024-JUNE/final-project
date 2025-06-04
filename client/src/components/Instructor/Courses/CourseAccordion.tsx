import { Section } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CourseAccordionProps = {
  sections: Section[];
};

export const CourseAccordion = ({ sections }: CourseAccordionProps) => {
  if (!sections || sections.length === 0) {
    return <p className="text-gray-500 text-sm">No sections available.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full flex flex-col gap-2">
      {sections?.map((section) => (
        <AccordionItem key={section.id} value={section.id.toString()}>
          <AccordionTrigger className="text-base font-semibold border rounded-md p-4">
            <div className="flex items-center justify-between">
              <p>{section.name}</p>
              <span className="ml-2 text-sm text-gray-500">
                ({section.videos.length} lesson
                {section.videos.length > 1 ? "s" : ""})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-4">
            {section.videos.map((video, idx) => (
              <div key={video.id} className="py-1 text-gray-700 text-sm">
                {idx + 1}. {video.title}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
