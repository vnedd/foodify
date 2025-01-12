import React, { Suspense } from "react";
import RecipeWrapper from "./_components/recipe-wrapper";

const RecipesPage = async () => {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <Suspense>
        <RecipeWrapper />
      </Suspense>
    </div>
  );
};

export default RecipesPage;
