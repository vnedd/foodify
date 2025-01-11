"use client";

import { DataTable } from "@/components/ui/data-table";
import { RecipeType } from "@/app/_actions/recipes/type";
import { columns } from "./column";
interface RecipesClientProps {
  data: RecipeType[];
}

const RecipesClient: React.FC<RecipesClientProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} />;
};

export default RecipesClient;
