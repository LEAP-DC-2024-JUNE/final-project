"use client";

<<<<<<< HEAD
import Image from "next/image";
import { Course } from "@/utils/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import DeleteCourseCard from "@/components/Buttons/DeleteCourseCard";
=======
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import DeleteCourseCard from "@/components/Buttons/DeleteCourseCard";
import { Course } from "@/utils/types";
>>>>>>> 887f81e (changes in da class)

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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="cursor-pointer"
    >
<<<<<<< HEAD
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
=======
      <Card
        className="w-[300px] h-[340px] flex flex-col justify-between overflow-hidden relative"
        onClick={handleClick}
      >
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteCourseCard course={course} onDelete={onRemove} />
        </div>

        <CardTitle className="w-full px-4 pt-3 text-lg font-semibold text-center">
          {course.title}
        </CardTitle>

        <div className="w-full py-0">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
        </div>

        <CardFooter className="flex flex-col px-4 gap-1 text-sm text-gray-600">
          <p className="line-clamp-1">{course.description}</p>
          <span className="text-black font-medium">
            ${course.price.toFixed(2)}
          </span>
        </CardFooter>
      </Card>
>>>>>>> 887f81e (changes in da class)
    </motion.div>
  );
};

export default CourseCard;
