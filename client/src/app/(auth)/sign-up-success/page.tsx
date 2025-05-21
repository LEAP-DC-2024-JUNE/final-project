"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpSuccess() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!isSignedIn || !user) {
      alert("You must be signed in to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const role = localStorage.getItem("selectedRole") || "STUDENT";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/sync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            role,
          }),
        }
      );

      const data = await res.json();

      if (data?.success) {
        localStorage.removeItem("selectedRole");
        router.push("/dashboard");
      } else {
        throw new Error(data?.error || "Failed to sync user.");
      }
    } catch (err: any) {
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="border p-5 rounded-2xl bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">
          You're successfully signed up!
        </h1>
        <p className="mb-6 text-gray-600 max-w-md">
          Click the button below to complete your account setup and access your
          dashboard.
        </p>
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className={`px-6 py-3 rounded text-white transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-500 hover:bg-black"
          }`}
        >
          {isLoading ? "Setting up..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
