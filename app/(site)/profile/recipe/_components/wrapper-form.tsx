import React, { Suspense } from "react";
import { getCuisines } from "@/app/_actions/cuisines";
import { getCategories } from "@/app/_actions/categories";
import RecipeForm from "./recipe-form";
import Loading from "./loading";

const WrapperForm = async () => {
  const cuisines = await getCuisines();
  const categories = await getCategories();
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <RecipeForm cuisines={cuisines} categories={categories} />
      </Suspense>
    </div>
  );
};

export default WrapperForm;
