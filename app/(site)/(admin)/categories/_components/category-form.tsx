"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  categorySchema,
  TcategorySchema,
} from "@/app/_actions/categories/schema";
import { Button } from "@/components/ui/button";
import UploadImageButton from "@/components/common/upload-button";
import { useAction } from "next-safe-action/hooks";
import ActionMessage from "@/components/common/action-message";
import { Category } from "@prisma/client";
import {
  addCategoryAction,
  updateCategoryAction,
} from "@/app/_actions/categories";
import UploadWidget from "@/components/common/upload-widget";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CategoryFormProps {
  type: "add" | "update";
  initialData?: Category;
}

export function CategoryForm({ type, initialData }: CategoryFormProps) {
  const {
    execute: addExecute,
    reset: addReset,
    isExecuting: addExecuting,
    result: addResult,
  } = useAction(addCategoryAction, {
    onSuccess: ({ data }) => {
      addReset();
    },
  });

  const {
    execute: updateExecute,
    reset: updateReset,
    isExecuting: updateExecuting,
    result: updateResult,
  } = useAction(updateCategoryAction, {
    onSuccess: ({ data }) => {
      updateReset();
    },
  });

  const form = useForm<TcategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      image: initialData?.image || "",
      description: initialData?.description || "",
    },
  });

  async function onSubmit(data: TcategorySchema) {
    if (type === "add") {
      addExecute(data);
    } else if (type === "update") {
      updateExecute({ ...data, id: initialData?.id as string });
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      <Card className="space-y-5">
        <CardHeader>
          <h4 className="font-semibold text-xl">
            {type === "add" ? "Add new Category" : "Update category"}
          </h4>
        </CardHeader>

        <CardContent>
          <ActionMessage result={type === "add" ? addResult : updateResult} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 col-span-full">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <UploadWidget
                            value={field.value}
                            disabled={
                              addExecuting || updateExecuting ? true : false
                            }
                            onChange={(url) => field.onChange(url)}
                            onRemove={() => field.onChange("")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the name of the category.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={
                              addExecuting || updateExecuting ? true : false
                            }
                            placeholder="Describe the category"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={addExecuting || updateExecuting ? true : false}
                    className="ml-auto"
                  >
                    {type === "add" &&
                      (addExecuting ? "Adding..." : "Add Category")}
                    {type === "update" &&
                      (updateExecuting ? "Updating..." : "Udate Category")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
