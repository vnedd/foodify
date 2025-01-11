"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";

interface UploadImageButtonProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  className?: string;
  initUrl: string;
  isDisabled?: boolean;
}

const UploadImageButton = ({
  onChange,
  endpoint,
  className,
  initUrl,
  isDisabled,
}: UploadImageButtonProps) => {
  const { toast } = useToast();
  const [image, setImage] = useState<string>(initUrl);
  return (
    <div className="aspect-square relative border-dashed border rounded-md ">
      <Image
        src={image}
        alt="preview image"
        className="object-cover rounded-md"
        fill
      />
      <UploadButton
        disabled={isDisabled}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 "
        appearance={{
          button: cn(
            "px-2 text-xs bg-gray-400 dark:bg-gray-200 text-black dark:text-gray-600 text-nowrap",
            className
          ),
          allowedContent: cn("hidden"),
        }}
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          const data = res[0].url;
          onChange(data);
          setImage(data);
          toast({
            title: "Upload image success!",
            description: format(new Date(), "MMMM do, yyyy"),
          });
        }}
        onUploadError={(error: Error) => {
          toast({
            title: "Upload image failed!",
            variant: "destructive",
            description: `${error?.message}`,
          });
        }}
      />
    </div>
  );
};

export default UploadImageButton;
