"use client";
import SchoolCart from "./SchoolCart";
import { motion } from "framer-motion";

const MySchools = () => {
  return (
    <div className=" flex flex-col items-start justify-between mx-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-medium">Schools I own:</p>
        <div className=" py-10 flex flex-row items-center gap-10 flex-wrap">
          <SchoolCart />
          <SchoolCart />
          <SchoolCart />
          <SchoolCart />
        </div>
      </motion.div>
    </div>
  );
};

export default MySchools;
