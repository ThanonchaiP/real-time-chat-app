import { ImageIcon } from "lucide-react";
import { useRef, ChangeEvent } from "react";
import { toast } from "sonner";

import { useUploadImage } from "@/features/home/api/upload-image";
import { UploadFileResponse } from "@/features/home";

interface UploadImageProps {
  onUploadComplete?: (data: UploadFileResponse) => void;
  disabled?: boolean;
}

export const UploadImage = ({
  onUploadComplete,
  disabled = false,
}: UploadImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadImage, isPending } = useUploadImage({
    onSuccess: (data) => {
      onUploadComplete?.(data);
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  const handleClick = () => {
    if (disabled || isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB", {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    uploadImage(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <ImageIcon
        className={`w-5 h-5 transition-colors shrink-0 ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 cursor-pointer hover:text-blue-600"
        }`}
        onClick={handleClick}
      />
    </>
  );
};
