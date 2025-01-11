import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { RiEmotionHappyLine } from "react-icons/ri";
import { CiWarning } from "react-icons/ci";

type Props = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    validationErrors?: Record<string, string[] | undefined>;
  };
};

const MessageBox = ({
  type,
  content,
}: {
  type: "success" | "error";
  content: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-accent px-2 py-3 my-2 text-sm rounded-lg flex items-center space-x-2 max-w-md",
        type === "error"
          ? "text-red-500 bg-red-100"
          : "bg-green-50 text-green-600"
      )}
    >
      {type === "success" ? (
        <RiEmotionHappyLine className="w-5 h-5 mr-2" />
      ) : (
        <CiWarning className="w-5 h-5 mr-2" />
      )}
      <>{content}</>
    </div>
  );
};

const ActionMessage = ({ result }: Props) => {
  const { data, serverError, validationErrors } = result;
  return (
    <div>
      {data?.message && (
        <MessageBox type="success" content={`Success: ${data.message}`} />
      )}
      {serverError && <MessageBox type="error" content={serverError} />}
      {validationErrors && (
        <MessageBox
          type="error"
          content={Object.keys(validationErrors).map((key) => (
            <p key={key}>
              {validationErrors[key as keyof typeof validationErrors]}
            </p>
          ))}
        />
      )}
    </div>
  );
};

export default ActionMessage;
