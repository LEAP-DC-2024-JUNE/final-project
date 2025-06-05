"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectUrl");
  const redirectUrl =
    rawRedirect && rawRedirect !== "/sign-in-success" ? rawRedirect : null;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        forceRedirectUrl={
          redirectUrl
            ? `/sign-in-success?redirectUrl=${redirectUrl}`
            : `/sign-in-success`
        }
        signUpUrl={
          redirectUrl ? `/sign-up?redirectUrl=${redirectUrl}` : `/sign-up`
        }
      />
    </div>
  );
}
