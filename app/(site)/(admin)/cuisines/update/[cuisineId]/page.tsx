import React from "react";
import { redirect } from "next/navigation";
import { CuisineForm } from "../../_components/cuisines-form";
import { getCuisineById } from "@/app/_actions/cuisines";

interface UpdateCuisineProps {
  params: Promise<{
    cuisineId: string;
  }>;
}

const UpdateCuisine = async ({ params }: UpdateCuisineProps) => {
  const resolvedParams = await params;
  const cuisine = await getCuisineById(resolvedParams.cuisineId);
  if (!cuisine) {
    redirect("/admin/categories");
  }
  return (
    <div>
      <CuisineForm type="update" initialData={cuisine} />
    </div>
  );
};

export default UpdateCuisine;
