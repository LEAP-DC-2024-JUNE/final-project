"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function RouteUserPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === "undefined") return;

    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const role = localStorage.getItem("userRole");
    console.log("RouteUserPage - User role:", role);

    if (!role) {
      console.log("No role found, redirecting to home");
      router.push("/");
      return;
    }

    const setRoleAndRedirect = async () => {
      try {
        // POST role to your backend
        await fetch("http://localhost:4000/api/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, role }),
        }).catch((err) => {
          console.error("Fetch error:", err);
        });

        localStorage.removeItem("userRole");

        // Redirect based on role
        if (role === "teacher") {
          console.log("Redirecting to teacher dashboard");
          router.push("/dashboard/teacher");
        } else if (role === "student") {
          console.log("Redirecting to student dashboard");
          router.push("/dashboard/student");
        } else {
          console.log("Invalid role, redirecting to home");
          router.push("/");
        }
      } catch (err) {
        console.error("Error setting role:", err);
        router.push("/");
      }
    };

    setRoleAndRedirect();
  }, [isLoaded, user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center ">
        <h2 className="text-2xl font-bold mb-4">
          Redirecting you to your dashboard...
        </h2>
      </div>
    </div>
  );
}
