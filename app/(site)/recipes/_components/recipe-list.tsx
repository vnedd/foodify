"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getInfinityRecipes } from "@/app/_actions/recipes";
import { RecipeType } from "@/app/_actions/recipes/type";
import RecipeItem from "./recipe-item";
import RecipeCategoryFilter from "./recipe-category-filter";
import { Category } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { CgSpinnerTwo } from "react-icons/cg";

export const RECIPES_PER_PAGE = 6;

type RecipeListProps = {
  initialData: RecipeType[];
  categories: Category[];
};

const RecipeList = ({ initialData, categories }: RecipeListProps) => {
  const [offset, setOffset] = useState<number>(0);
  const [recipes, setRecipes] = useState<RecipeType[]>(initialData);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollTrigger, isInView] = useInView();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const loadMoreRecipes = async (query: {
    category?: string;
    title?: string;
  }) => {
    if (hasMoreData && !isLoading) {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setRecipes(initialData);
    setOffset(0);
    setHasMoreData(true);
    setIsLoading(false);
  }, [categoryParam, initialData]);

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
          <div
            ref={scrollTrigger}
            className="p-8 flex items-center justify-center"
          >
            {isLoading && (
              <CgSpinnerTwo className="animate-spin h-8 w-8 mx-auto text-primary" />
            )}
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
