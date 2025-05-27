import InstructorSideMenu from "@/components/SideMenu/InstructorSideMenu";
export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <InstructorSideMenu />
      <main className=" ml-[365px] w-full h-auto bg-[#F4F4F5] px-5 pb-10">
        {children}
      </main>
    </div>
  );
}
