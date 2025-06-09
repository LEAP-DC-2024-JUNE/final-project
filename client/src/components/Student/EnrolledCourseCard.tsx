"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface EnrolledCourseCardProps {
  courseId: string;
  title: string;
  price: number;
  imageUrl: string;
  enrolledAt: string;
}

export const EnrolledCourseCard = ({
  courseId,
  title,
  price,
  imageUrl,
  enrolledAt,
}: EnrolledCourseCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col bg-white">
      <div className="relative w-full h-48">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-gray-600 text-sm mb-2">Price: ${price}</p>
        <p className="text-gray-500 text-sm mb-4">
          Enrolled on {format(new Date(enrolledAt), "MMM dd, yyyy")}
        </p>
        <Link
          href={`/enrolled-course/${courseId}`}
          className="mt-auto bg-teal-600 hover:bg-teal-700 text-white text-center py-2 px-4 rounded"
        >
          Go to Course
        </Link>
      </div>
    </div>
  );
};
