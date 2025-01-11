import React from "react";
import UpdateWrapperForm from "../../_components/update-wraper-form";

interface UpdateRecipePageProps {
  params: Promise<{
    recipeId: string;
  }>;
}

const UpdateRecipePage = async ({ params }: UpdateRecipePageProps) => {
  const resolvedParams = await params;
  return <UpdateWrapperForm id={resolvedParams.recipeId} />;
};

export default UpdateRecipePage;
