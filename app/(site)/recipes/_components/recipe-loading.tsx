import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const RecipeLoading = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-nowrap space-x-3">
        <Skeleton className="w-16 h-9" />
        <Skeleton className="w-16 h-9" />
        <Skeleton className="w-16 h-9" />
        <Skeleton className="w-16 h-9" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="aspect-video w-full" />
      </div>
    </div>
  );
};

export default RecipeLoading;
