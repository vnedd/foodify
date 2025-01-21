"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PiTagSimple } from "react-icons/pi";
import { PiTagSimpleFill } from "react-icons/pi";
import { savedRecipeAction, unSavedRecipeAction } from "@/app/_actions/recipes";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface Props {
  recipeId: string;
  initialSavedState: boolean;
}

const SavedButton = ({ recipeId, initialSavedState }: Props) => {
  const [isSaved, setIsSaved] = useState<boolean>(initialSavedState);
  const { toast } = useToast();
  const { execute: savedExecute, isExecuting: savedExecuting } = useAction(
    savedRecipeAction,
    {
      onSuccess: () => {
        setIsSaved(true);
        toast({
          title: "Add this recipe to saved!",
          description: format(Date.now(), "MMMM do, yyyy"),
        });
      },
    }
  );
  const { execute: unsavedExecute, isExecuting: unLikeExecuting } = useAction(
    unSavedRecipeAction,
    {
      onSuccess: () => {
        setIsSaved(false);
        toast({
          title: "Remove this recipe to saved!",
          description: format(Date.now(), "MMMM do, yyyy"),
        });
      },
    }
  );

  const handleSaved = () => {
    if (savedExecuting || unLikeExecuting) return;
    if (isSaved) {
      unsavedExecute({ id: recipeId });
    } else {
      savedExecute({ id: recipeId });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className={cn("flex items-center space-x-1 text-xs")}
            role="button"
            onClick={handleSaved}
          >
            {isSaved ? (
              <PiTagSimpleFill className="w-5 h-5 text-primary rotate-90" />
            ) : (
              <PiTagSimple className="w-5 h-5 text-muted-foreground rotate-90" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Saved recipe</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SavedButton;
