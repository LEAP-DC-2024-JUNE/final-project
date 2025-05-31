"use client";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";

const MyCourses = () => {
  return (
    <div className=" flex flex-col items-start justify-between mx-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-medium">Courses I own:</p>
        <div className=" py-10 flex flex-row items-center gap-10 flex-wrap">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </motion.div>
    </div>
  );
};

export default MyCourses;
