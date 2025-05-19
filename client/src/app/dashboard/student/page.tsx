"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function StudentDashboard() {
  const { user } = useUser();
  const role = user?.unsafeMetadata?.role as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-semibold mb-6">
          Welcome, {user?.firstName || "Student"}!
        </h2>
      </main>
    </div>
  );
}
