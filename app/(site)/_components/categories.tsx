import { getCategories } from "@/app/_actions/categories";
import React from "react";
import CategoryCard from "./category-card";

const Categories = async () => {
  const categories = await getCategories();

  return (
    <div className="space-y-4 w-full">
      <h3 className="font-semibold text-xl">Today’s popular categories</h3>
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 md:gap-6 gap-4 w-full">
        {categories.map((cate) => (
          <CategoryCard category={cate} key={cate.id} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
