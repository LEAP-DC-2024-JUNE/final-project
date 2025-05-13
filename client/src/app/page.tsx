import { Card, CardContent } from "@/components/ui/card";
import * as motion from "motion/react-client";
import Image from "next/image";
import Teacher from "../svg/teacher.svg";
import Student from "../svg/student.svg";
const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5 p-4">
      <h1 className="text-4xl font-bold text-center">Welcome to ClassHub!</h1>
      <p className="text-lg mb-6">Choose your role to continue</p>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Card className="h-64 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="bg-zinc-100 p-4 rounded-full mb-4">
                <Image
                  src={Teacher}
                  alt="teacher-image"
                  width={45}
                  height={45}
                />
              </div>
              <p className="text-xl font-semibold">I'm a Teacher</p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Create classes, manage assignments, and track student progress
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Card className="h-64 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="bg-zinc-100 p-4 rounded-full mb-4">
                <Image
                  src={Student}
                  alt="student-image"
                  width={45}
                  height={45}
                />
              </div>
              <p className="text-xl font-semibold">I'm a Student</p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Join classes, submit assignments, and track your learning
                progress
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
