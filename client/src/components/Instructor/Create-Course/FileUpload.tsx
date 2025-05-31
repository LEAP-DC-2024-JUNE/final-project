"use client";

import type React from "react";
import { useRef, useState } from "react";
import { PreviewImage } from "./PreviewImage";
import { DragAndDropField } from "./DragandDropField";

interface FileUploadProps {
  setFoodInput: React.Dispatch<React.SetStateAction<any>>;
}

const FileUpload = ({ setFoodInput }: FileUploadProps) => {
  const fileInputElementRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleFileSelection = (file: File) => {
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      setFoodInput((prevValues: any) => ({ ...prevValues, image: file }));
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      handleFileSelection(selectedFile);
    }
  };

  const triggerFileInputClick = () => {
    if (fileInputElementRef.current) {
      fileInputElementRef.current.click();
    }
  };

  const resetFileInput = () => {
    setImagePreviewUrl(null);

    if (fileInputElementRef.current) {
      fileInputElementRef.current.value = "";
    }

    setFoodInput((prevValues: any) => ({ ...prevValues, image: "" }));
  };

  return (
    <div className="space-y-2">
      {imagePreviewUrl ? (
        <PreviewImage
          imagePreviewUrl={imagePreviewUrl}
          resetFileInput={resetFileInput}
        />
      ) : (
        <DragAndDropField
          triggerFileInputClick={triggerFileInputClick}
          handleFileSelection={handleFileSelection}
        />
      )}

      <input
        ref={fileInputElementRef}
        type="file"
        name="image"
        hidden
        onChange={onFileInputChange}
        accept="image/*"
      />
    </div>
  );
};

export default FileUpload;
