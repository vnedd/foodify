"use client";

import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { Category } from "@prisma/client";
import { CategoriesColumn, columns } from "./column";
interface CategoriesClientProps {
  data: Category[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({ data }) => {
  const formatedCategories: CategoriesColumn[] = data.map((cate) => {
    return {
      id: cate.id,
      name: cate.name,
      image: cate.image,
      description: cate.description,
      createdAt: format(cate.createdAt, "MMMM do, yyyy"),
    };
  });

  return <DataTable columns={columns} data={formatedCategories} />;
};

export default CategoriesClient;
