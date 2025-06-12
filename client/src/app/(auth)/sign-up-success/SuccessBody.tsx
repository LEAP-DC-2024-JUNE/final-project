"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessBody({
  handleContinue,
  isLoading,
}: {
  handleContinue: (redirectUrl: string | null, role: string | null) => void;
  isLoading: boolean;
}) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const role = localStorage.getItem("selectedRole");

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
          onClick={() => handleContinue(redirectUrl, role)}
          disabled={isLoading}
          className={`px-6 py-3 rounded text-white transition ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-black hover:bg-gray-400"
          }`}
        >
          {isLoading ? "Setting up..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
