"use client";
import React from "react";
import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import qs from "query-string";

interface Props {
  categories: Category[];
}

const RecipeCategoryFilter = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentCategory = searchParams.get("category");

  const handleSelect = (value: string | null) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          category: value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <div className="flex max-w-full overflow-x-auto text-base space-x-3">
      <Button
        variant={!currentCategory ? "default" : "outline"}
        onClick={() => handleSelect(null)}
        size="sm"
      >
        All
      </Button>
      {categories.map((item) => {
        const isSelected = item.slug === currentCategory;
        return (
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            key={item.id}
            onClick={() => handleSelect(item.slug)}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default RecipeCategoryFilter;
