"use client";
import React from "react";
import { RecipeType } from "@/app/_actions/recipes/type";
import Image from "@/components/common/image";
import { MdOutlineAccessTime } from "react-icons/md";
import { PiChefHat } from "react-icons/pi";
import { IoEarthOutline } from "react-icons/io5";
import { DifficulType } from "@prisma/client";
import RecipeAuthor from "./recipe-author";
import { useSession } from "next-auth/react";
import RecipeAuthorActions from "./recipe-author-actions";
import RecipeActions from "./recipe-actions";
import Link from "next/link";

interface Props {
  item: RecipeType;
}

const difficultLevel: Record<DifficulType, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  DIFFICULT: "Difficult",
};

const RecipeItem = ({ item }: Props) => {
  const { data: session } = useSession();
  const isAuthor = session?.user.id === item.authorId;
  const hour = Math.floor((item.prepTime + item.cookTime) / 60);
  const mins = item.prepTime + item.cookTime - hour * 60;

  return (
    <div className="shadow-lg flex flex-col space-y-4 p-4 py-6 rounded-2xl dark:border">
      <div className="flex justify-between">
        <RecipeAuthor recipe={item} />
        {isAuthor && <RecipeAuthorActions item={item} />}
      </div>
      <div className="relative aspect-video w-full rounded-lg overflow-hidden">
        <Image
          src={item.image}
          className={"object-cover"}
          alt={item.title}
          fill
        />
      </div>
      <div className="flex flex-col  gap-2  ">
        <div className="space-y-1">
          <Link
            href={`/recipes/${item.id}`}
            className="font-semibold md:text-base text-sm line-clamp-1"
          >
            {item.title}
          </Link>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {item.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="flex text-muted-foreground text-sm items-center space-x-2 text-nowrap">
            <MdOutlineAccessTime className="mr-1 w-4 h-4" />
            {hour > 0 && `${hour} hour${hour > 1 ? "s" : ""}`}{" "}
            {mins > 0 && `${mins} min${mins > 1 ? "s" : ""}`}
          </p>
          <p className="flex text-muted-foreground text-sm items-center space-x-2 text-nowrap">
            <PiChefHat className="mr-1 w-4 h-4" />
            {difficultLevel[item.difficulty]}
          </p>
          <p className="flex text-muted-foreground text-sm items-center space-x-2 text-nowrap">
            <IoEarthOutline className="mr-1 w-4 h-4" />
            {item.cuisine.name}
          </p>
        </div>
      </div>
      <RecipeActions recipe={item} />
    </div>
  );
};

export default RecipeItem;
