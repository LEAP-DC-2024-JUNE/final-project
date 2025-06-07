import StudentSideMenu from "@/components/SideMenu/StudentSideMenu";
import MyEnrollmentsPage from "../my-enrollments/page";
import MyEnrolledCourses from "@/components/Student/MyEnrolledCourses";

export default function DashboardPage() {
  return (
    <div>
      <StudentSideMenu />
      <MyEnrolledCourses />
    </div>
  );
}
