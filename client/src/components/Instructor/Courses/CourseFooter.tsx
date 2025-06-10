export const CourseFooter = () => {
  return (
    <footer className="bg-[#2f3c3c] px-[84px] py-10">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-10">
          <p className="text-white text-2xl">© 2025 Instructor's Course</p>
          <span className=" bg-teal-600 rounded-md border border-green-600 p-3 text-white text-xl w-[180px]">
            Built with <span className="text-teal-300">SURAA</span>
          </span>
        </div>
        <div className="flex flex-col gap-2 pr-[150px]">
          <p className="text-lg text-white">Terms of Use</p>
          <p className="text-lg text-white">Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};
