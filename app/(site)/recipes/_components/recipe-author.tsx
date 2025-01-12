import React from "react";
import { format } from "date-fns";

import { RecipeType } from "@/app/_actions/recipes/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  recipe: RecipeType;
}

const RecipeAuthor = ({ recipe }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="border-collapse border-2 border-slate-600 dark:border-primary w-9 h-9">
        <AvatarImage
          className=""
          src={recipe.author.image || "/avatar.jpg"}
          alt="@shadcn"
        />
        <AvatarFallback>FO</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-bold text-sm">
          {recipe.author.name || recipe.author.email}
        </p>
        <p className="text-muted-foreground text-xs">
          {format(recipe.createdAt, "d MMMM 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default RecipeAuthor;
