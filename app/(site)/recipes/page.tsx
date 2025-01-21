import React, { Suspense } from "react";
import RecipeWrapper from "./_components/recipe-wrapper";
import RecipeLoading from "./_components/recipe-loading";
import TopRecipeLoading from "./_components/top-recipe-loading";
import TopRecipeWrapper from "./_components/top-recipe-wrapper";

const RecipesPage = async () => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="lg:col-span-3 md:col-span-2 col-span-full">
        <Suspense fallback={<RecipeLoading />}>
          <RecipeWrapper />
        </Suspense>
      </div>
      <div className="lg:col-span-1 md:col-span-2 hidden md:block">
        <Suspense fallback={<TopRecipeLoading />}>
          <TopRecipeWrapper />
        </Suspense>
      </div>
    </div>
  );
};

export default RecipesPage;
