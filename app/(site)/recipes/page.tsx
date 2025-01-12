import React, { Suspense } from "react";
import RecipeWrapper from "./_components/recipe-wrapper";

const RecipesPage = async () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="lg:col-span-3 col-span-full">
        <Suspense>
          <RecipeWrapper />
        </Suspense>
      </div>
      <div className="lg:col-span-1 hidden lg:block">Top recipe</div>
    </div>
  );
};

export default RecipesPage;
