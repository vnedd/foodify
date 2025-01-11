import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeType } from "@/app/_actions/recipes/type";
import { IoEyeOutline } from "react-icons/io5";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const columns: ColumnDef<RecipeType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger>
              <div className="relative w-12 h-12 group flex items-center justify-center sr-only">
                <IoEyeOutline className="w-4 h-4 z-10 text-white opacity-0 group-hover:opacity-100 transition" />
                <Image
                  fill
                  src={row.original.image as string}
                  alt={row.original.title}
                  className="aspect-square w-full rounded-md group-hover:brightness-75 transition object-cover"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="md:w-[500px] md:h-[500px] w-[90%] h-[500px] p-4 rounded-md">
              <VisuallyHidden>
                <DialogTitle>x</DialogTitle>
              </VisuallyHidden>
              <div className="relative w-full h-full">
                <Image
                  fill
                  src={row.original.image as string}
                  alt={row.original.title}
                  className="aspect-square w-full rounded-md group-hover:brightness-75 transition object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>
          <div className="space-y-2">
            <p className="font-medium line-clamp-1">{row.original.title}</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="line-clamp-1 max-w-96">{row.original.description}</p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <p className="line-clamp-1 max-w-96">
        {format(row.original.createdAt, "MMMM do, yyyy")}
      </p>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="w-7 h-7 rounded-md">
          <AvatarImage src={row.original.author.image || "/avatar.png"} />
          <AvatarFallback>{row.original.author.name}</AvatarFallback>
        </Avatar>
        <p className="line-clamp-1 max-w-96">{row.original.author.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <p className="line-clamp-1 max-w-96">{row.original.category.name}</p>
    ),
  },
  {
    accessorKey: "cuisine",
    header: "Cuisine",
    cell: ({ row }) => (
      <p className="line-clamp-1 max-w-96">{row.original.cuisine.name}</p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
