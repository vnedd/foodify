"use client";

import React, { useState } from "react";
import { BiLike } from "react-icons/bi";
import { AiFillLike } from "react-icons/ai";
import { useAction } from "next-safe-action/hooks";
import { likeRecipeAction, unlikeRecipeAction } from "@/app/_actions/recipes";
import { cn } from "@/lib/utils";

interface Props {
  recipeId: string;
  initialLikeCount: number;
  initialLikeState: boolean;
}

const LikeButton = ({
  recipeId,
  initialLikeCount,
  initialLikeState,
}: Props) => {
  const [isLiked, setIsLiked] = useState<boolean>(initialLikeState);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount || 0);

  const { execute: likeExecute, isExecuting: likeExecuting } = useAction(
    likeRecipeAction,
    {
      onSuccess: () => {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      },
    }
  );
  const { execute: unlikeExecute, isExecuting: unLikeExecuting } = useAction(
    unlikeRecipeAction,
    {
      onSuccess: () => {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      },
    }
  );

  const handleLike = () => {
    if (likeExecuting || unLikeExecuting) return;
    if (isLiked) {
      unlikeExecute({ id: recipeId });
    } else {
      likeExecute({ id: recipeId });
    }
  };

  return (
    <div
      className={cn("flex items-center space-x-1 text-xs")}
      role="button"
      onClick={handleLike}
    >
      <div className="p-2 pr-0 cursor-pointer">
        {isLiked ? (
          <AiFillLike className="w-4 h-4 text-primary" />
        ) : (
          <BiLike className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <p className="text-muted-foreground select-none">
        {likeCount || 0} likes
      </p>
    </div>
  );
};

export default LikeButton;
