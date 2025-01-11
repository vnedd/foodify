import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-10 w-2/3" />
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-10 full" />
      <Skeleton className="h-10 full" />
    </div>
  );
};

export default Loading;
