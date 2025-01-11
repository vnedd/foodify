"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface FileUploadDropzoneProps {
  onChange: (urls?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  className?: string;
  disabled?: boolean;
}

const FileUploadDropzone = ({
  onChange,
  endpoint,
  className,
  disabled,
}: FileUploadDropzoneProps) => {
  const { toast } = useToast();
  return (
    <UploadDropzone
      disabled={disabled}
      className="border-dashed p-6 cursor-pointer ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
      appearance={{
        button: cn(
          "text-xs px-2 bg-slate-800 active:ring-slate-800",
          className
        ),
        container: {
          display: "flex",
          background: "gray-500 ",
        },
      }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const data = res[0].url;
        onChange(data);
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
  );
};

export default FileUploadDropzone;
