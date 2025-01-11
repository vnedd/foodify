import { useState } from "react";
import { IoMdMore } from "react-icons/io";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { CuisinesColumn } from "./column";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AlertModal from "@/components/common/alert-modal";
import { deteleCuisine } from "@/app/_actions/cuisines";

interface CellActionProps {
  data: CuisinesColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { execute: deleteExecute, isExecuting: deleteExecuting } = useAction(
    deteleCuisine,
    {
      onSuccess: ({ data }) => {
        toast({
          title: "Delete cuisine successfully!",
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
        title="Are you sure you want to delete this cuisine?"
        description="This action cannot be undone. This will permanently delete your cuisine and remove it from our servers."
        onConfirm={() => handleDelete(data.id)}
        loading={deleteExecuting}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IoMdMore className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={deleteExecuting}
            onClick={() => router.push(`/admin/cuisines/update/${data.id}`)}
          >
            <BiEditAlt className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <AiOutlineDelete className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
