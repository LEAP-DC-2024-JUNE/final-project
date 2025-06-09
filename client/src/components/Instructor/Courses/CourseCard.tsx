"use client";

import Image from "next/image";
import { Course } from "@/utils/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import DeleteCourseCard from "@/components/Buttons/DeleteCourseCard";

interface CourseCardProps {
  course: Course;
  onRemove: (id: number) => void;
}

const CourseCard = ({ course, onRemove }: CourseCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/course/${course.id}`);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className=" cursor-pointer"
    >
      <div
        className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col bg-white w-[300px] h-[300px]"
        onClick={handleClick}
      >
        <div className="relative w-full h-48">
          <div className="absolute top-2 right-2 z-10">
            <DeleteCourseCard course={course} onDelete={onRemove} />
          </div>
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
          <p className="text-gray-500 text-sm mb-4 line-clamp-1">
            {course.description}
          </p>
          <p className="text-gray-600 text-sm mb-2">Price: ${course.price}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
