import React, { Suspense } from "react";
import RecipeList from "./_components/recipe-list";
import { Skeleton } from "@/components/ui/skeleton";

const RecipeLoading = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-52 h-8" />
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>
    </div>
  );
};

const PublishedRecipePage = async () => {
  return (
    <Suspense fallback={<RecipeLoading />}>
      <div className="max-w-6xl mx-auto">
        <RecipeList />
      </div>
    </Suspense>
  );
};

export default PublishedRecipePage;
