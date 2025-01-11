import { getRecipesByUser } from "@/app/_actions/recipes";
import React from "react";
import RecipeItem from "./recipe-item";

const RecipeList = async () => {
  const recipes = await getRecipesByUser();
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-xl">Your Published recipes</h3>
      {recipes.length ? (
        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {recipes.map((item) => (
            <RecipeItem item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-20 text-sm text-muted-foreground">
          You don't have recipes
        </div>
      )}
    </div>
  );
};

export default RecipeList;
