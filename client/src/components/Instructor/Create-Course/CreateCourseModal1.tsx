"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, File, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../ui/textarea";
import FileUpload from "./FileUpload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function CreateCourseModal1({ isOpen, onClose }: any) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Course
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="grid gap-6 py-4 h-[570px]">
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input id="courseName" placeholder="Enter course name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseDescription">Course Description</Label>
              <Textarea
                id="courseDescription"
                placeholder="Enter course description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coursePrice">Course Price</Label>
              <Input id="coursePrice" placeholder="Enter course price" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file_input">Course Image</Label>
              <FileUpload />
            </div>

            <div className="flex justify-end gap-2 mt-auto">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
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
              <Button type="button" variant="outline" onClick={handleBack}>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
