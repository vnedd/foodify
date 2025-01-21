import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TopRecipeLoading = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-20" />
    </div>
  );
};

export default TopRecipeLoading;
