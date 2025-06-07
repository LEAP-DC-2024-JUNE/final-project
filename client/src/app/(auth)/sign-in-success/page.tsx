"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect, Suspense } from "react";

export default function SignInSuccess() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isSignedIn || !user) return;

      try {
        const token = await getToken({ template: "suraa" });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(token);

        if (res.ok && data.user?.role) {
          setRole(data.user.role);
        } else {
          console.error("Failed to fetch user role:", data.error);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserRole();
  }, [isSignedIn, user, getToken]);

  const handleContinue = () => {
    if (!role) return;
    setIsLoading(true);

    if (redirectUrl && redirectUrl !== "/sign-in-success") {
      router.push(redirectUrl);
    } else if (role === "INSTRUCTOR") {
      router.push("/instructor/my-schools");
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="border p-5 rounded-2xl bg-gray-50">
          <h1 className="text-3xl font-bold mb-4">
            You're successfully signed in!
          </h1>
          <p className="mb-6 text-gray-600 max-w-md">
            Click the button below to access your dashboard.
          </p>
          <button
            onClick={handleContinue}
            disabled={isLoading || !role}
            className={`px-6 py-3 rounded text-white transition ${
              isLoading || !role
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-400"
            }`}
          >
            {isLoading ? "Accessing..." : "Continue"}
          </button>
        </div>
      </div>
    </Suspense>
  );
}
