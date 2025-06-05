import InstructorSideMenu from "@/components/SideMenu/InstructorSideMenu";

export default function DashboardPage() {
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
  return (
    <div>
      <InstructorSideMenu />
    </div>
  );
}
