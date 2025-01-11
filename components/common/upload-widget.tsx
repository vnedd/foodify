"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { GoTrash } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { CiImageOn } from "react-icons/ci";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
  value: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full aspect-square border border-dashed rounded-lg relative group ">
      {value && (
        <>
          <div className="z-50 absolute top-2 right-2 rounded-lg overflow-hidden">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="w-7 h-7 rounded-md"
            >
              <GoTrash className="h-4 w-4" />
            </Button>
          </div>
          <Image
            fill
            className="object-cover rounded-lg"
            alt="image"
            src={value}
          />
        </>
      )}
      {!value && (
        <CldUploadWidget
          onSuccess={(result, { close }) => {
            close();
          }}
          onSuccessAction={onUpload}
          uploadPreset="dy6dvtou"
        >
          {({ open }) => {
            const onClick = () => {
              open();
            };
            return (
              <div
                className={cn(
                  "absolute w-full h-full z-40 cursor-pointer group-hover:brightness-95 bg-secondary/20",
                  disabled && "cursor-not-allowed"
                )}
                onClick={onClick}
              >
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <CiImageOn className="w-6 h-6 text-gray-300 group-hover:text-primary/70" />
                </button>
              </div>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
  );
};

export default ImageUpload;
