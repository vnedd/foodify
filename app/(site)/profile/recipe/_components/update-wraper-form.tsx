import React, { Suspense } from "react";
import { getCuisines } from "@/app/_actions/cuisines";
import { getCategories } from "@/app/_actions/categories";
import RecipeForm from "./recipe-form";
import Loading from "./loading";
import { getRecipeById } from "@/app/_actions/recipes";
import { redirect } from "next/navigation";

interface Props {
  id: string;
}

const UpdateWrapperForm = async ({ id }: Props) => {
  const cuisines = await getCuisines();
  const categories = await getCategories();
  const recipe = await getRecipeById(id);
  if (!recipe) {
    redirect("/profile/published");
  }
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <RecipeForm
          cuisines={cuisines}
          categories={categories}
          initialData={recipe}
        />
      </Suspense>
    </div>
  );
};

export default UpdateWrapperForm;
