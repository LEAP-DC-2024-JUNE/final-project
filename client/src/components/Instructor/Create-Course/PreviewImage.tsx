"use client";

import Image from "next/legacy/image";

export const PreviewImage = ({
  imagePreviewUrl,
  resetFileInput,
  isUploading,
}: any) => {
  return (
    <div className="relative">
      <div className="flex">
        <Image
          src={imagePreviewUrl || "/placeholder.svg"}
          alt="preview"
          height={180}
          width={446}
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
          <div className="text-white text-sm">Uploading...</div>
        </div>
      )}

      {!isUploading && (
        <div
          className="absolute top-4 right-4 flex items-center bg-gray-300 hover:bg-gray-400 justify-center w-6 h-6 rounded-full cursor-pointer transition-colors"
          onClick={resetFileInput}
        >
          ×
        </div>
      )}
    </div>
  );
};
