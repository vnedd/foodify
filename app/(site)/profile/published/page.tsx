import React, { Suspense } from "react";
import RecipeList from "./_components/recipe-list";

const PublishedRecipePage = async () => {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <Suspense fallback="loading....">
          <RecipeList />
        </Suspense>
      </div>
      <div className="col-span-1">Top recipe list</div>
    </div>
  );
};

export default PublishedRecipePage;
