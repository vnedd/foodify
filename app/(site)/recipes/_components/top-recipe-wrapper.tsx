import React from "react";
import { getTopRecipes } from "@/app/_actions/recipes";
import Image from "@/components/common/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const TopRecipeWrapper = async () => {
  const topRecipes = await getTopRecipes();

  return (
    <Card className="sticky top-16">
      <CardHeader>
        <h3 className="font-bold text-lg">Top Recipes</h3>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col space-y-3">
          {topRecipes.map((item) => (
            <Link
              href={`/recipes/${item.id}`}
              key={item.id}
              className="flex space-x-3 items-center p-2 rounded-md cursor-pointer hover:shadow-md bg-white dark:bg-secondary"
            >
              <div className="relative aspect-square w-[60px] h-[60px] rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  className={"object-cover"}
                  alt={item.title}
                  fill
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold line-clamp-1 text-sm">
                  {item.title}
                </h4>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopRecipeWrapper;
