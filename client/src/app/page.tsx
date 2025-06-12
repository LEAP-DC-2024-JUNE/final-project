// "use client";
// import { Card, CardContent } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
// import * as motion from "motion/react-client";
// import Image from "next/image";
// import Teacher from "../svg/teacher.svg";
// import Student from "../svg/student.svg";
// const Home = () => {
//   const router = useRouter();

//   return (
//     <div className="flex flex-col justify-center items-center h-screen gap-5 p-4">
//       <h1 className="text-4xl font-bold text-center">Welcome to SURAA!</h1>
//       <p className="text-lg mb-6">Choose your role to Sign Up!</p>

//       <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="flex-1"
//           onClick={() => router.push("/sign-up?role=INSTRUCTOR")}
//         >
//           <Card className="h-64 cursor-pointer hover:shadow-lg transition-shadow">
//             <CardContent className="flex flex-col items-center justify-center h-full p-6">
//               <div className="bg-zinc-100 p-4 rounded-full mb-4">
//                 <Image
//                   src={Teacher}
//                   alt="teacher-image"
//                   width={45}
//                   height={45}
//                 />
//               </div>
//               <p className="text-xl font-semibold">I'm a Teacher</p>
//               <p className="text-sm text-gray-500 text-center mt-2">
//                 Create classes, manage assignments, and track student progress
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="flex-1"
//           onClick={() => router.push("/sign-up?role=STUDENT")}
//         >
//           <Card className="h-64 cursor-pointer hover:shadow-lg transition-shadow">
//             <CardContent className="flex flex-col items-center justify-center h-full p-6">
//               <div className="bg-zinc-100 p-4 rounded-full mb-4">
//                 <Image
//                   src={Student}
//                   alt="student-image"
//                   width={45}
//                   height={45}
//                 />
//               </div>
//               <p className="text-xl font-semibold">I'm a Student</p>
//               <p className="text-sm text-gray-500 text-center mt-2">
//                 Join classes, submit assignments, and track your learning
//                 progress
//               </p>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Home;

"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import Image from "next/image";
import Teacher from "../svg/teacher.svg";
import Student from "../svg/student.svg";
import Footer from "@/components/Footer";

const Home = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="max-w-3xl w-full text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Welcome to SURAA!
          </h1>
          <p className="text-lg text-gray-600">
            Choose your role to sign up and start learning or teaching
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
            onClick={() => router.push("/sign-up?role=INSTRUCTOR")}
          >
            <Card className="h-64 cursor-pointer hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="bg-zinc-100 p-5 rounded-full mb-4">
                  <Image
                    src={Teacher}
                    alt="teacher-image"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  I'm a Teacher
                </p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Create classes, manage assignments, and track student
                  progress.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
            onClick={() => router.push("/sign-up?role=STUDENT")}
          >
            <Card className="h-64 cursor-pointer hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="bg-zinc-100 p-5 rounded-full mb-4">
                  <Image
                    src={Student}
                    alt="student-image"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  I'm a Student
                </p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Join classes, submit assignments, and track your learning
                  progress.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/sign-in")}
              className="text-blue-600 hover:underline font-medium"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
