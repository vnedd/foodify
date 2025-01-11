import React from "react";
import { CategoryForm } from "../../_components/category-form";
import { getCategoryById } from "@/app/_actions/categories";
import { redirect } from "next/navigation";

interface UpdateCategoryProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const UpdateCategory = async ({ params }: UpdateCategoryProps) => {
  const resolvedParams = await params;
  const category = await getCategoryById(resolvedParams.categoryId);
  if (!category) {
    redirect("/admin/categories");
  }
  return (
    <div>
      <CategoryForm type="update" initialData={category} />
    </div>
  );
};

export default UpdateCategory;
