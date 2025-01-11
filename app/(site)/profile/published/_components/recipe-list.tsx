import { getRecipesByUser } from "@/app/_actions/recipes";
import React from "react";
import RecipeItem from "./recipe-item";

const RecipeList = async () => {
  const recipes = await getRecipesByUser();
  return (
    <div>
      {recipes.length ? (
        <div className="grid md:grid-cols-2 gap- w-full">
          {recipes.map((item) => (
            <RecipeItem item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-20 text-sm text-muted">
          No recipes
        </div>
      )}
    </div>
  );
};

export default RecipeList;
