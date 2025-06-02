"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCourseModal1 } from "./CreateCourseModal1";
import CourseSection from "./CourseSection";

export default function CreateCoursePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className=" flex flex-col items-start justify-start min-h-screen p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" w-full flex flex-col items-center gap-8"
        >
          <div className="flex flex-col items-center gap-4  text-center">
            <div className="p-4 bg-zinc-100 rounded-full text-center">
              <School className="w-12 h-12 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-bold">Create a New Course</h1>
            <p className="text-zinc-500 max-w-md">
              Start your teaching journey by creating a new school. Add courses,
              upload videos, and share your knowledge with students.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-400 hover:bg-zinc-500 text-white px-8 py-6 text-lg"
          >
            Get Started
          </Button>
        </motion.div>

        <CreateCourseModal1
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}
