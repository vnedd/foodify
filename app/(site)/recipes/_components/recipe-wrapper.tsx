import { getInfinityRecipes } from "@/app/_actions/recipes";
import React from "react";
import RecipeList, { RECIPES_PER_PAGE } from "./recipe-list";

const RecipeWrapper = async () => {
  const initialRecipes = await getInfinityRecipes({
    offset: 0,
    limit: RECIPES_PER_PAGE,
  });
  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-center text-2xl mb-2">Loading posts on scroll</h1>
      <h3 className="text-center mb-5 text-slate-600">
        With an additional dependency (
        <a href="https://www.npmjs.com/package/react-intersection-observer">
          React Intersection Observer
        </a>
        )
      </h3>
      <RecipeList initialData={initialRecipes} />
    </div>
  );
};

export default RecipeWrapper;
