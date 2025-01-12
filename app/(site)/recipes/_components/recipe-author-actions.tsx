"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";

import { RecipeType } from "@/app/_actions/recipes/type";
import { deteleRecipeAction } from "@/app/_actions/recipes";
import { useToast } from "@/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";
import AlertModal from "@/components/common/alert-modal";
import Link from "next/link";

interface Props {
  item: RecipeType;
}

const RecipeAuthorActions = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { execute: deleteExecute, isExecuting: deleteExecuting } = useAction(
    deteleRecipeAction,
    {
      onSuccess: ({ data }) => {
        toast({
          title: "Delete recipe successfully!",
          description: "",
        });
        setOpen(false);
      },
    }
  );
  const handleDelete = (id: string) => {
    deleteExecute({ id });
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Are you sure you want to delete this recipe?"
        description="This action cannot be undone. This will permanently delete your recipe and remove it from our servers."
        onConfirm={() => handleDelete(item.id)}
        loading={deleteExecuting}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HiOutlineDotsHorizontal size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href={`/profile/recipe/update/${item.id}`}
              className="flex gap-2 items-center"
            >
              <FiEdit /> Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            color="#cccccc"
            className="cursor-pointer"
            onSelect={() => setOpen(true)}
          >
            <LuTrash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RecipeAuthorActions;
