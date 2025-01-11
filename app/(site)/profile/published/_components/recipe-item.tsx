"use client";
import React, { useState } from "react";
import { RecipeType } from "@/app/_actions/recipes/type";
import Image from "@/components/common/image";
import { MdOutlineAccessTime } from "react-icons/md";
import { PiChefHat } from "react-icons/pi";
import { DifficulType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { GoTrash } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deteleRecipeAction } from "@/app/_actions/recipes";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import AlertModal from "@/components/common/alert-modal";
interface Props {
  item: RecipeType;
}

const difficultLevel: Record<DifficulType, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  DIFFICULT: "Difficult",
};

const RecipeItem = ({ item }: Props) => {
  const hour = Math.floor((item.prepTime + item.cookTime) / 60);
  const mins = item.prepTime + item.cookTime - hour * 60;
  const [open, setOpen] = useState(false);
  const router = useRouter();
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
      <div className="shadow-lg flex gap-2 p-3 rounded-lg">
        <div className="relative aspect-5/6 overflow-hidden w-1/3 rounded-lg group shrink-0">
          <Image
            src={item.image}
            className={
              "aspect-5/6 object-cover group-hover:scale-125 transition"
            }
            alt={item.title}
            fill
          />
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="p-2 space-y-2">
            <h3 className="font-semibold md:text-base text-sm">{item.title}</h3>
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {item.description}
            </p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
            <p className="flex text-muted-foreground text-sm items-center space-x-2">
              <MdOutlineAccessTime className="mr-1 w-4 h-4" />
              {hour > 0 && `${hour} hour${hour > 1 ? "s" : ""}`}{" "}
              {mins > 0 && `${mins} min${mins > 1 ? "s" : ""}`}
            </p>
            <p className="flex text-muted-foreground text-sm items-center space-x-2">
              <PiChefHat className="mr-1 w-4 h-4" />
              {difficultLevel[item.difficulty]}
            </p>
          </div>
          <div className="flex items-center mt-auto justify-end gap-2">
            <Button
              className=""
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              Delete <GoTrash />
            </Button>
            <Link href={`/profile/recipe/update/${item.id}`}>
              <Button variant="outline" size="sm">
                Update <FiEdit />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeItem;
