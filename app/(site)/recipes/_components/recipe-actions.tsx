import React from "react";
import { BsChatRight } from "react-icons/bs";
import { BiLike, BiTag } from "react-icons/bi";
import Link from "next/link";
import { RecipeType } from "@/app/_actions/recipes/type";

interface Props {
  recipe: RecipeType;
}

const RecipeActions = ({ recipe }: Props) => {
  return (
    <div className="flex items-center text-sm">
      <div className="flex items-center space-x-6 text-muted-foreground">
        <div className="flex items-center gap-2">
          <BiLike size={18} />
          <p>120k likes</p>
        </div>
        <Link
          href={`/recipes/${recipe.id}`}
          className="flex items-center gap-2"
        >
          <BsChatRight size={16} />
          <p>25 comments</p>
        </Link>
      </div>
      <div className="ml-auto">
        <BiTag size={20} />
      </div>
    </div>
  );
};

export default RecipeActions;
