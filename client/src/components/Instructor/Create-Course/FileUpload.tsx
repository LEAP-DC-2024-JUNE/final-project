"use client";

import type React from "react";
import { useRef, useState } from "react";
import { PreviewImage } from "./PreviewImage";
import { DragAndDropField } from "./DragandDropField";

interface FileUploadProps {
  setFormState: React.Dispatch<React.SetStateAction<any>>;
}

const FileUpload = ({ setFormState }: FileUploadProps) => {
  const fileInputElementRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const CLOUD_NAME = "dd3imxxlm";

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUD_NAME);

    try {
      console.log("Uploading to Cloudinary...");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Upload response status:", uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Cloudinary error response:", errorText);
        throw new Error(
          `Upload failed: ${uploadResponse.status} - ${errorText}`
        );
      }

      const uploadedImageData = await uploadResponse.json();
      console.log("Upload successful:", uploadedImageData);

      return uploadedImageData.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleFileSelection = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    setIsUploading(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);

      setFormState((prevValues: any) => ({
        ...prevValues,
        image: file,
        imageUrl: previewUrl,
      }));

      try {
        const cloudinaryUrl = await uploadToCloudinary(file);

        setFormState((prevValues: any) => ({
          ...prevValues,
          imageUrl: cloudinaryUrl,
        }));
        console.log(
          "Image uploaded successfully to Cloudinary:",
          cloudinaryUrl
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary upload failed, using local preview instead:",
          cloudinaryError
        );
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message}`);

      // Reset on error
      setImagePreviewUrl(null);
      if (fileInputElementRef.current) {
        fileInputElementRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      handleFileSelection(selectedFile);
    }
  };

  const triggerFileInputClick = () => {
    if (fileInputElementRef.current && !isUploading) {
      fileInputElementRef.current.click();
    }
  };

  const resetFileInput = () => {
    setImagePreviewUrl(null);

    if (fileInputElementRef.current) {
      fileInputElementRef.current.value = "";
    }

    setFormState((prevValues: any) => ({
      ...prevValues,
      image: null,
      imageUrl: "",
    }));
  };

  return (
    <div className="space-y-2">
      {imagePreviewUrl ? (
        <PreviewImage
          imagePreviewUrl={imagePreviewUrl}
          resetFileInput={resetFileInput}
          isUploading={isUploading}
        />
      ) : (
        <DragAndDropField
          triggerFileInputClick={triggerFileInputClick}
          handleFileSelection={handleFileSelection}
          isUploading={isUploading}
        />
      )}

      <input
        ref={fileInputElementRef}
        type="file"
        name="image"
        hidden
        onChange={onFileInputChange}
        accept="image/*"
        disabled={isUploading}
      />

      {isUploading && (
        <div className="text-center">
          <p className="text-sm text-blue-600">Uploading image...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
