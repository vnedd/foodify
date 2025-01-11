import React from "react";
import { getCategories } from "@/app/_actions/categories";
import CategoriesClient from "./_components/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Categories = async () => {
  const categories = await getCategories();
  return (
    <div className="flex flex-col space-y-3">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Categories</h3>
            <Link href={"/categories/add"}>
              <Button size="sm">
                <IoMdAdd className="w-5 h-5" />
                Add new
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <CategoriesClient data={categories} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
