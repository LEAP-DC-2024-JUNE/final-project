// "use client";

// import { Suspense, useState } from "react";
// import { useUser, useAuth } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function SignUpSuccess() {
//   const [isLoading, setIsLoading] = useState(false);

//   const { getToken } = useAuth();
//   const router = useRouter();
//   const { user, isSignedIn } = useUser();
//   const searchParams = useSearchParams();
//   const redirectUrl = searchParams.get("redirectUrl");

//   const handleContinue = async () => {
//     if (!isSignedIn || !user) {
//       alert("You must be signed in to continue.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const token = await getToken({ template: "suraa" });

//       if (!token) {
//         throw new Error("No token found. Please sign in again.");
//       }
//       const role = localStorage.getItem("selectedRole");
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/sync`,

//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             email: user.primaryEmailAddress?.emailAddress,
//             role,
//           }),
//         }
//       );
//       console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

//       const data = await res.json();

//       if (redirectUrl && redirectUrl !== "/sign-in-success") {
//         router.push(redirectUrl);
//       } else if (data?.success && role === "INSTRUCTOR") {
//         localStorage.removeItem("selectedRole");
//         router.push("/instructor/dashboard");
//       } else if (data?.success && role === "STUDENT") {
//         localStorage.removeItem("selectedRole");
//         router.push("/student/dashboard");
//       } else {
//         throw new Error(data?.error || "Failed to sync user.");
//       }
//     } catch (err: any) {
//       alert(`Something went wrong: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Suspense>
//       <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
//         <div className="border p-5 rounded-2xl bg-gray-50">
//           <h1 className="text-3xl font-bold mb-4">
//             You're successfully signed up!
//           </h1>
//           <p className="mb-6 text-gray-600 max-w-md">
//             Click the button below to complete your account setup and access
//             your dashboard.
//           </p>
//           <button
//             onClick={handleContinue}
//             disabled={isLoading}
//             className={`px-6 py-3 rounded text-white transition ${
//               isLoading
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-black hover:bg-gray-400"
//             }`}
//           >
//             {isLoading ? "Setting up..." : "Continue"}
//           </button>
//         </div>
//       </div>
//     </Suspense>
//   );
// }

"use client";

import { Suspense, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SuccessBody from "./SuccessBody";

export default function SignUpSuccess() {
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async (
    redirectUrl: string | null,
    role: string | null
  ) => {
    if (!isSignedIn || !user) {
      alert("You must be signed in to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken({ template: "suraa" });
      if (!token) throw new Error("No token found. Please sign in again.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            role,
          }),
        }
      );

      const data = await res.json();

      if (redirectUrl && redirectUrl !== "/sign-in-success") {
        router.push(redirectUrl);
      } else if (data?.success && role === "INSTRUCTOR") {
        localStorage.removeItem("selectedRole");
        router.push("/instructor/dashboard");
      } else if (data?.success && role === "STUDENT") {
        localStorage.removeItem("selectedRole");
        router.push("/student/dashboard");
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
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessBody handleContinue={handleContinue} isLoading={isLoading} />
    </Suspense>
  );
}
