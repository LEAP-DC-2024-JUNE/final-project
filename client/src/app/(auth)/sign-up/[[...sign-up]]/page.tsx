"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "STUDENT";

  useEffect(() => {
    if (role) {
      localStorage.setItem("selectedRole", role);
    }
  }, [role]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp forceRedirectUrl={"/sign-up-success"} />
    </div>
  );
}
