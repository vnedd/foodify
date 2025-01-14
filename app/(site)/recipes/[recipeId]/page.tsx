import React from "react";
import { notFound, redirect } from "next/navigation";
import { IoTimeOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { PiChefHat } from "react-icons/pi";
import { MdOutlineCategory } from "react-icons/md";
import { IoEarthOutline } from "react-icons/io5";

import { DifficulType } from "@prisma/client";
import Image from "@/components/common/image";
import RecipeAuthor from "../_components/recipe-author";
import { getRecipeById } from "@/app/_actions/recipes";

interface RecipePageProps {
  params: Promise<{
    recipeId: string;
  }>;
}
const difficultLevel: Record<DifficulType, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  DIFFICULT: "Difficult",
};

const RecipePage = async ({ params }: RecipePageProps) => {
  const resolvedParams = await params;
  const recipe = await getRecipeById(resolvedParams.recipeId);

  if (!recipe) {
    redirect("/");
  }

  const cookTimehour = Math.floor(recipe.cookTime / 60);
  const cookTimemins = recipe.cookTime - cookTimehour * 60;

  const prepTimehour = Math.floor(recipe.prepTime / 60);
  const prepTimemins = recipe.prepTime - prepTimehour * 60;

  return (
    <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
      <div className="col-span-3 space-y-6 flex flex-col w-full max-w-2xl">
        <div className="space-y-4">
          <h3 className="font-extrabold lg:text-4xl md:text-xl text-lg">
            {recipe?.title}
          </h3>
          <RecipeAuthor recipe={recipe} />
          <div className="relative aspect-video w-full max-w-2xl">
            <Image
              src={recipe.image}
              className={"object-cover"}
              alt={recipe.title}
              fill
            />
          </div>
          <p className="text-justify text-sm">{recipe.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 border rounded-lg p-4 pt-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-8 bg-primary" />
          <div className="flex flex-col">
            <p className="font-bold">Prep Time:</p>
            <p className="text-muted-foreground text-sm flex items-center">
              <IoTimeOutline className="mr-1" />
              {prepTimehour > 0 &&
                `${prepTimehour} hour${prepTimehour > 1 ? "s" : ""}`}{" "}
              {prepTimemins > 0 &&
                `${prepTimemins} min${prepTimemins > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Cook Time:</p>
            <p className="text-muted-foreground text-sm flex items-center">
              <IoTimeOutline className="mr-1" />
              {cookTimehour > 0 &&
                `${cookTimehour} hour${cookTimehour > 1 ? "s" : ""}`}{" "}
              {cookTimemins > 0 &&
                `${cookTimemins} min${cookTimemins > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Servings: </p>
            <p className="text-muted-foreground text-sm flex items-center">
              <HiOutlineUserGroup className="mr-1" />
              {recipe.servings}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Difficult: </p>
            <p className="text-muted-foreground text-sm flex items-center">
              <PiChefHat className="mr-1" />
              {difficultLevel[recipe.difficulty]}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Cuisine: </p>
            <p className="text-muted-foreground text-sm flex items-center">
              <IoEarthOutline className="mr-1" />
              {recipe.cuisine.name}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Category: </p>
            <p className="text-muted-foreground text-sm flex items-center">
              <MdOutlineCategory className="mr-1" />
              {recipe.category.name}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-2xl">Ingredients</h3>
          <ul className="list-disc ml-5 space-y-2.5 marker:text-green-600 list-outside">
            {recipe.ingredients
              .toSorted((a, b) => a.order - b.order)
              .map((item) => (
                <li key={item.id}>{item.label}</li>
              ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-2xl">Directions</h3>
          <ul className="space-y-8">
            {recipe.steps
              .toSorted((a, b) => a.order - b.order)
              .map((item, index) => (
                <li key={item.id} className="space-y-4">
                  <div>
                    <h4 className="font-bold text-xl">Step {index + 1}</h4>
                    <p className="mt-2 text-justify">{item.label}</p>
                  </div>
                  {item.image && (
                    <div className="relative aspect-video w-full max-w-2xl ">
                      <Image
                        src={item.image}
                        className={"object-cover"}
                        alt={item.label}
                        fill
                      />
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default RecipePage;
