"use client";

import DeleteCourseCard from "@/components/Buttons/DeleteCourseCard";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Course } from "@/utils/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
      <Card className="w-[300px] h-[300px] py-0" onClick={handleClick}>
        <div className="relative flex flex-col  items-center h-full">
          <div className="absolute top-2 right-2 z-10">
            <DeleteCourseCard course={course} onDelete={onRemove} />
          </div>
          <CardTitle className=" mt-8">{course.title}</CardTitle>
          <CardContent>
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-40 object-cover rounded"
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <div>{course.description}</div>
            <div>${course.price}</div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
