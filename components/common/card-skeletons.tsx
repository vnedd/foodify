import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
};

const CardSkeletons = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "grid lg:grid-cols-6 md:gap-6 gap:4 md:grid-cols-4 grid-cols-2",
        className
      )}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="aspect-5/6" />
      ))}
    </div>
  );
};

export default CardSkeletons;
