import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Upload, File, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SectionModal = () => {
  return (
    <div>
      <div className="grid gap-6 py-4 h-[570px]">
        <div className="space-y-4">
          <div className="grid gap-2 py-5">
            <Label htmlFor="courseName">Course Name</Label>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Course Sections</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          </div>

          <Accordion type="multiple" className="w-full bg-zinc-100">
            <AccordionItem value="section-1">
              <div className="flex items-center justify-between ">
                <AccordionTrigger className="flex-1">
                  <Input
                    defaultValue="Section 1"
                    className="max-w-[200px] mr-2"
                  />
                </AccordionTrigger>

                <div className=" flex gap-4 flex-row items-center cursor-pointer">
                  <Check
                    size={20}
                    className=" hover:bg-zinc-100 transition-colors"
                  />
                  <Trash2 className="h-4 w-4  hover:bg-zinc-100" />
                </div>
              </div>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <Input placeholder="Video title" className="flex-1" />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 mt-2"
                  >
                    <Plus className="h-4 w-4" /> Add Video
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex justify-between gap-2 mt-auto">
          <Button type="button" variant="outline">
            Go Back
          </Button>
          <Button
            type="button"
            className="bg-zinc-400 hover:bg-zinc-500 text-white"
          >
            Create Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
