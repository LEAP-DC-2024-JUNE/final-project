import Image from "next/legacy/image";

export const PreviewImage = ({ imagePreviewUrl, resetFileInput }: any) => {
  return (
    <div className="relative">
      <div className="flex">
        <Image
          src={imagePreviewUrl}
          alt="preview"
          height={180}
          width={416}
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <div
        className="absolute top-1 right-12 flex items-center bg-gray-300 justify-center w-6 h-6 rounded-full cursor-pointer"
        onClick={resetFileInput}
      >
        x
      </div>
    </div>
  );
};
