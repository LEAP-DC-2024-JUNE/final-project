"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  allowedRole: string;
  children: React.ReactNode;
};

export default function RoleProtection({ allowedRole, children }: Props) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const userRole = user.unsafeMetadata.role;

    // if (userRole !== allowedRole) {
    //   router.push("/");
    // }
  }, [isLoaded, user, allowedRole, router]);

  if (!isLoaded) return null;

  const userRole = user?.unsafeMetadata?.role;

  if (userRole !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}
