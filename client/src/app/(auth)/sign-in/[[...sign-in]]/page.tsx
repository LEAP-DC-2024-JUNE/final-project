"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/sign-in-success";

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        forceRedirectUrl={`/sign-in-success?redirectUrl=${redirectUrl}`}
        signUpUrl={`/sign-up?redirectUrl=${redirectUrl}`}
      />
    </div>
  );
}
