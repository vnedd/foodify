"use client";

import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { Cuisine } from "@prisma/client";
import { columns, CuisinesColumn } from "./column";
interface CuisineClientProps {
  data: Cuisine[];
}

const CuisineClient: React.FC<CuisineClientProps> = ({ data }) => {
  const formatedCuisine: CuisinesColumn[] = data.map((cate) => {
    return {
      id: cate.id,
      name: cate.name,
      country: cate.country,
      region: cate.region || "",
      description: cate.description || "",
      createdAt: format(cate.createdAt, "MMMM do, yyyy"),
    };
  });

  return <DataTable columns={columns} data={formatedCuisine} />;
};

export default CuisineClient;
