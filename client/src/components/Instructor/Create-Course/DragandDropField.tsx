import { useState } from "react";
import Image from "next/legacy/image";

export const DragAndDropField = ({
  handleFileSelection,
  triggerFileInputClick,
}: any) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = Array.from(event.dataTransfer.files).at(0);
    handleFileSelection(droppedFile);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={triggerFileInputClick}
      className={`flex flex-col items-center justify-center gap-y-2 cursor-pointer bg-[#e7eeff] h-[180px] border rounded-md ${
        isDragging ? "border-dashed border-gray-600" : "border-solid"
      }`}
    >
      <div className="flex items-center justify-center bg-white rounded-full w-7 h-7">
        <Image
          src="/icons/add-image-icon.svg"
          width={12}
          height={12}
          alt="add-image-icon"
          priority
        />
      </div>

      <h4 className="text-sm text-center">
        Choose a file or drag & drop it here
      </h4>
    </div>
  );
};
