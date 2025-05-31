"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

import { motion } from "framer-motion";

const CourseCard = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className=" cursor-pointer"
    >
      <Card className=" w-[300px] h-[300px]">
        <div className=" flex flex-col justify-between items-center">
          <CardTitle>Tittle</CardTitle>
          <CardContent>Image</CardContent>
          <CardFooter>Description</CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
