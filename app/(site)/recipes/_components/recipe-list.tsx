"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { getInfinityRecipes } from "@/app/_actions/recipes";
import { RecipeType } from "@/app/_actions/recipes/type";
export const RECIPES_PER_PAGE = 10;

type RecipeListProps = {
  initialData: RecipeType[];
};

const RecipeList = ({ initialData }: RecipeListProps) => {
  const [offset, setOffset] = useState<number>(0);
  const [recipes, setRecipes] = useState<RecipeType[]>(initialData);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [scrollTrigger, isInView] = useInView();

  const loadMoreRecipes = async () => {
    if (hasMoreData) {
      const apiRecipes = await getInfinityRecipes({
        offset,
        limit: RECIPES_PER_PAGE,
      });

      if (apiRecipes.length == 0) {
        setHasMoreData(false);
      }

      setRecipes((prevRecipes) => [...prevRecipes, ...apiRecipes]);
      setOffset((prevOffset) => prevOffset + RECIPES_PER_PAGE);
    }
  };

  useEffect(() => {
    if (isInView && hasMoreData) {
      loadMoreRecipes();
    }
  }, [isInView, hasMoreData]);

  return (
    <>
      <div className="...">
        {recipes?.map((recipe) => (
          <div key={recipe.id}>{recipe.title}</div>
        ))}
      </div>
      <div className="text-center text-slate-600 mt-5">
        {(hasMoreData && <div ref={scrollTrigger}>Loading...</div>) || (
          <p className="text-slate-600">No more recipes to load</p>
        )}
      </div>
    </>
  );
};

export default RecipeList;
