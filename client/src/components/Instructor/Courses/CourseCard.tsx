"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Course } from "@/utils/types";
import { motion } from "framer-motion";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className=" cursor-pointer"
    >
      <Card className=" w-[300px] h-[300px]">
        <div className=" flex flex-col justify-between items-center">
          <CardTitle>{course.title}</CardTitle>
          <CardContent>
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-32 object-cover rounded"
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
