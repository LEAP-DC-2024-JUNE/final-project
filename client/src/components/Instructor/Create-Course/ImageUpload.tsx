"use client";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";

export default function ImageUpload() {
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState("");

  async function onSubmit(data: any) {
    const image = data.CourseImage[0]; // data dotroos CourseImage aa tataj awaj bn
    const formData = new FormData(); // formData gdg box vvsgeed
    formData.append("file", image); // formData dotroo image and upload presetee add hiine
    formData.append("upload_preset", "leapdc-preset");
    // making API request
    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dd3imxxlm/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    // this what u get back from request
    const uploadedImageData = await uploadResponse.json();
    console.log(uploadedImageData);
    const imageUrl = uploadedImageData.secure_url;
    setImageUrl(imageUrl);
  }
  return (
    <div className=" px-[250px]">
      <form className=" mt-7 mx-16" onSubmit={handleSubmit(onSubmit)}>
        <label className=" text-sm font-medium" htmlFor="file_input">
          Upload file
        </label>
        <input
          {...register("FoodImage")}
          className="block  text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          SVG, PNG, JPG or GIF (MAX. 800x400px).
        </p>

        <button
          type="submit"
          className=" bg-slate-300 border-2 my-5 rounded-md px-4"
        >
          Upload to Cloud
        </button>
      </form>

      <hr />

      {imageUrl && (
        <Image
          width={420}
          height={270}
          src={imageUrl}
          alt="banner"
          className=" my-5"
        />
      )}
    </div>
  );
}
