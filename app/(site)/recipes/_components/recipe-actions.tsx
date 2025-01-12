import React from "react";
import { BsChatRight } from "react-icons/bs";
import { BiLike, BiTag } from "react-icons/bi";
const RecipeActions = () => {
  return (
    <div className="flex items-center text-sm">
      <div className="flex items-center space-x-4 text-muted-foreground">
        <div className="flex items-center gap-1">
          <BiLike />
          <p>120k likes</p>
        </div>
        <div className="flex items-center gap-1">
          <BsChatRight />
          <p>25 comments</p>
        </div>
      </div>
      <div className="ml-auto">
        <BiTag size={20} />
      </div>
    </div>
  );
};

export default RecipeActions;
