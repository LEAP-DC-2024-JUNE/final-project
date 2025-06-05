"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const rawRedirect = searchParams.get("redirectUrl");
  const redirectUrl =
    rawRedirect && rawRedirect !== "/sign-up-success" ? rawRedirect : null;

  useEffect(() => {
    if (role) {
      localStorage.setItem("selectedRole", role);
    }
  }, [role]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp
        forceRedirectUrl={
          redirectUrl
            ? `/sign-up-success?redirectUrl=${redirectUrl}`
            : `/sign-up-success`
        }
      />
    </div>
  );
}
