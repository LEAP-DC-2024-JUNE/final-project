"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { CirclePlus, LogOut, School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const InstructorSideMenu = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  return (
    <div className="w-[366px] min-h-screen bg-zinc-100 flex flex-col items-center justify-between fixed left-0 top-0 bottom-0 p-5">
      <div className="flex flex-col justify-between gap-10 items-center">
        <div className=" flex gap-1 ">
          <img src="../suraaLogo.svg" alt="logo" width={33} />
          <h1 className=" text-3xl font-extrabold ">SURAA</h1>
        </div>
        <Avatar className="w-40 h-40">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="w-40 h-40 object-cover"
          />
          <AvatarFallback className="w-40 h-40 text-2xl">U</AvatarFallback>
        </Avatar>
        <div>
          <p>Your name</p>
          <p>Your email</p>
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <Link href="/instructor/my-schools" className="group cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-5"
          >
            <School
              className={`!w-8 !h-8 transition-colors group-hover:text-orange-400 ${
                pathname === "/instructor/my-schools"
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[20px] font-medium transition-colors group-hover:text-orange-400 ${
                pathname === "/instructor/my-schools"
                  ? "text-orange-400"
                  : "text-zinc-500"
              }`}
            >
              My Schools
            </span>
          </motion.div>
        </Link>

        <Link href="/instructor/create-school" className="group cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-5"
          >
            <CirclePlus
              className={`!w-8 !h-8 transition-colors group-hover:text-orange-400 ${
                pathname === "/instructor/create-school"
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-[20px] font-medium transition-colors group-hover:text-orange-400 ${
                pathname === "/instructor/create-school"
                  ? "text-orange-400"
                  : "text-zinc-500"
              }`}
            >
              Create New School
            </span>
          </motion.div>
        </Link>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="group flex items-center gap-5 pl-1 rounded-md p-2 transition-colors cursor-pointer"
        >
          <LogOut className="!w-8 !h-8 text-gray-500 transition-colors group-hover:text-orange-400" />
          <span className="text-zinc-500 text-[20px] font-semibold transition-colors group-hover:text-orange-400">
            Sign Out
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorSideMenu;
