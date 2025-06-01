"use client";

import { useState } from "react";
import Image from "next/legacy/image";

export const DragAndDropField = ({
  handleFileSelection,
  triggerFileInputClick,
  isUploading,
}: any) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const droppedFile = Array.from(event.dataTransfer.files).at(0);
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => {
    if (!isUploading) {
      triggerFileInputClick();
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-y-2 h-[180px] border rounded-md transition-all ${
        isUploading
          ? "cursor-not-allowed bg-gray-100 border-gray-300"
          : isDragging
          ? "cursor-pointer bg-[#e7eeff] border-dashed border-gray-600"
          : "cursor-pointer bg-[#e7eeff] border-solid"
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
        {isUploading ? "Uploading..." : "Choose a file or drag & drop it here"}
      </h4>

      {!isUploading && (
        <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
      )}
    </div>
  );
};
