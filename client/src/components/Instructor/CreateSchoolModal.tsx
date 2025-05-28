"use client";

import { useState } from "react";
import { Upload, File, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Section {
  id: string;
  name: string;
  videos: {
    id: string;
    name: string;
    file: File | null;
  }[];
}

interface CreateSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSchoolModal({ isOpen, onClose }: CreateSchoolModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create New School
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input id="schoolName" placeholder="Enter school name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="courseTitle">Course Title</Label>
            <Input id="courseTitle" placeholder="Enter course title" />
          </div>

          {/* <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Course Sections</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Section
              </Button>
            </div>
          </div> */}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-zinc-400 hover:bg-zinc-500 text-white"
            >
              Continue 1/3
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
