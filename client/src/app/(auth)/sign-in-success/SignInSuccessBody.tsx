"use client";

import { useSearchParams } from "next/navigation";

export default function SignInSuccessBody({
  handleContinue,
  isLoading,
  role,
}: {
  handleContinue: (redirectUrl: string | null) => void;
  isLoading: boolean;
  role: string | null;
}) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="border p-5 rounded-2xl bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">
          You're successfully signed in!
        </h1>
        <p className="mb-6 text-gray-600 max-w-md">
          Click the button below to access your dashboard.
        </p>
        <button
          onClick={() => handleContinue(redirectUrl)}
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
  );
}
