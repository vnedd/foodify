import React from "react";
import { getInfinityRecipes } from "@/app/_actions/recipes";
import RecipeList, { RECIPES_PER_PAGE } from "./recipe-list";
import { getCategories } from "@/app/_actions/categories";

const RecipeWrapper = async () => {
  const initialRecipes = await getInfinityRecipes({
    offset: 0,
    limit: RECIPES_PER_PAGE,
  });
  const categories = await getCategories();
  return <RecipeList initialData={initialRecipes} categories={categories} />;
};

export default RecipeWrapper;
