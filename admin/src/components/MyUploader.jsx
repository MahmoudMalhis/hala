import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MyUploader({
  onUpload,
  resetPreview,
  imageURL,
  customStyle,
}) {
  const [image, setImage] = useState(null); // لتخزين الصورة

  useEffect(() => {
    if (resetPreview) {
      setImage(null);
    }
  }, [resetPreview]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      handleImageUpload(file);
    },
  });

  const handleRemoveImage = () => {
    setImage(null);
    onUpload("");
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload`,
        formData
      );
      setImage(`${import.meta.env.VITE_API_BASE_URL}${res.data.url}`);
      onUpload(res.data.url);
    } catch (err) {
      console.error("فشل رفع الصورة:", err);
    }
  };

  return (
    <div className={customStyle}>
      <div
        {...getRootProps()}
        className="w-full h-36 border-2 mb-4 border-dashed border-gray-400 p-4 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition duration-300 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="text-lg text-gray-600">اسحب الصورة أو اضغط هنا</p>
          <p className="text-sm text-gray-400">
            Drag and drop an image file here or click
          </p>
        </div>
      </div>
      {(image || imageURL) && (
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <img
              src={
                image ||
                (imageURL && `${import.meta.env.VITE_API_BASE_URL}${imageURL}`)
              }
              alt={`Uploaded preview`}
              className="w-48 h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 left-1 bg-red-500 hover:bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
