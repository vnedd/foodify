import React, { Suspense } from "react";
import RecipeWrapper from "./_components/recipe-wrapper";

const RecipesPage = async () => {
  return (
    <Suspense fallback={"loading...."}>
      <RecipeWrapper />
    </Suspense>
  );
};

export default RecipesPage;
