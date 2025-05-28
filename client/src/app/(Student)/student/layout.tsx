import StudentSideMenu from "@/components/SideMenu/StudentSideMenu";
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <StudentSideMenu />
      <main className=" ml-[365px] w-full h-auto">{children}</main>
    </div>
  );
}
