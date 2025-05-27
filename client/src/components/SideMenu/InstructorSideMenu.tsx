"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { CirclePlus, LogOut, School } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const InstructorSideMenu = () => {
  const pathname = usePathname();
  return (
    <div className="w-[367px] min-h-screen bg-zinc-100 flex flex-col items-center justify-between fixed left-0 top-0 bottom-0 p-5">
      <div className="flex flex-col justify-between gap-10 items-center">
        <p className="font-extrabold text-[30px]">SURAA</p>
        <Avatar className="w-40 h-40">
          <AvatarImage
            // src="https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/user-avatar.jpg"
            // alt="User Avatar"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="w-40 h-40 object-cover"
          />
          <AvatarFallback className="w-40 h-40 text-2xl">U</AvatarFallback>
        </Avatar>
        <p>Your email</p>
      </div>
      <div className="flex flex-col gap-20">
        <Link href="/instructor/my-schools">
          <Button
            variant="ghost"
            className={`flex items-center gap-5 transition-colors ${
              pathname === "/instructor/my-schools"
                ? "bg-zinc-800 text-white"
                : ""
            }`}
          >
            <School className="!w-8 !h-8 text-gray-500 hover:text-zinc-700 transition-colors" />
            <span className="text-zinc-500 text-[20px] hover:text-zinc-600 transition-colors">
              My Schools
            </span>
          </Button>
        </Link>

        <Link href="/instructor/create-school">
          <Button
            variant="ghost"
            className={`flex items-center gap-5 transition-colors ${
              pathname === "/instructor/create-school"
                ? "bg-zinc-800 text-white"
                : ""
            }`}
          >
            <CirclePlus className="!w-8 !h-8" color="gray" />
            <span className="text-zinc-500 text-[20px]">Create New School</span>
          </Button>
        </Link>

        <div className="flex items-center gap-5 pl-4">
          <LogOut className="!w-8 !h-8" color="gray" />
          <span className="text-zinc-500 text-[20px] font-semibold">
            <SignOutButton />
          </span>
        </div>
      </div>
    </div>
  );
};

export default InstructorSideMenu;
