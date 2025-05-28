"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn forceRedirectUrl={"/sign-in-success"} />
    </div>
  );
}
