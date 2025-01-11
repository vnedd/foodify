import { cn } from "@/lib/utils";
import React, { ReactNode, RefObject } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn("container max-w-screen-xl w-full mx-auto px-4", className)}
    >
      {children}
    </div>
  );
};

export default Container;
