"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getInfinityRecipes } from "@/app/_actions/recipes";
import { RecipeType } from "@/app/_actions/recipes/type";
import RecipeItem from "./recipe-item";
import RecipeCategoryFilter from "./recipe-category-filter";
import { Category } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import CardSkeletons from "@/components/common/card-skeletons";
export const RECIPES_PER_PAGE = 10;

type RecipeListProps = {
  initialData: RecipeType[];
  categories: Category[];
};

const RecipeList = ({ initialData, categories }: RecipeListProps) => {
  const [offset, setOffset] = useState<number>(0);
  const [recipes, setRecipes] = useState<RecipeType[]>(initialData);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [scrollTrigger, isInView] = useInView();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const loadMoreRecipes = async (query: {
    category?: string;
    title?: string;
  }) => {
    if (hasMoreData) {
      const apiRecipes = await getInfinityRecipes({
        offset,
        limit: RECIPES_PER_PAGE,
        categorySlug: query.category,
      });

      if (apiRecipes.length === 0) {
        setHasMoreData(false);
        return;
      }

      setRecipes((prevRecipes) => [...prevRecipes, ...apiRecipes]);
      setOffset((prevOffset) => prevOffset + RECIPES_PER_PAGE);
    }
  };

  // Reset state when category changes
  useEffect(() => {
    setRecipes(initialData);
    setOffset(0);
    setHasMoreData(true);
  }, [categoryParam, initialData]);

  // Handle infinite scroll
  useEffect(() => {
    if (isInView && hasMoreData) {
      loadMoreRecipes({
        category: categoryParam || undefined,
      });
    }
  }, [isInView, hasMoreData, categoryParam]);

  return (
    <div className="space-y-6 w-full">
      <RecipeCategoryFilter categories={categories} />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {recipes?.map((recipe) => (
          <RecipeItem key={recipe.id} item={recipe} />
        ))}
      </div>
      <div className="text-center text-muted-foreground mt-5 text-sm">
        {hasMoreData ? (
          <div ref={scrollTrigger}>
            <CardSkeletons className=" lg:grid-cols-2 md:gap-6 gap:4 md:grid-cols-2 grid-cols-2" />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No more recipes to load
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
