"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import UploadImageButton from "@/components/common/upload-button";
import { useAction } from "next-safe-action/hooks";
import ActionMessage from "@/components/common/action-message";
import { Cuisine } from "@prisma/client";
import { addCuisineAction, updateCuisineAction } from "@/app/_actions/cuisines";
import {
  cuisinesSchema,
  TCuisinesSchema,
} from "@/app/_actions/cuisines/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CuisineFormProps {
  type: "add" | "update";
  initialData?: Cuisine;
}

const regions: { [key: string]: string[] } = {
  "East Asia": ["Japan", "China", "South Korea"],
  "Southeast Asia": ["Vietnam", "Thailand", "Philippines"],
  "South Asia": ["India", "Pakistan", "Bangladesh"],
  Europe: ["France", "Germany", "Italy"],
  "North America": ["United States", "Canada", "Mexico"],
};

export function CuisineForm({ type, initialData }: CuisineFormProps) {
  const {
    execute: addExecute,
    reset: addReset,
    isExecuting: addExecuting,
    result: addResult,
  } = useAction(addCuisineAction, {
    onSuccess: ({ data }) => {
      addReset();
    },
  });

  const {
    execute: updateExecute,
    reset: updateReset,
    isExecuting: updateExecuting,
    result: updateResult,
  } = useAction(updateCuisineAction, {
    onSuccess: ({ data }) => {
      updateReset();
    },
  });

  const form = useForm<TCuisinesSchema>({
    resolver: zodResolver(cuisinesSchema),
    defaultValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      region: initialData?.region || "",
      country: initialData?.country || "",
      description: initialData?.description || "",
    },
  });

  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    if (form.getValues("region")) {
      setCountries(regions[form.getValues("region")] || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("region"), form]);

  async function onSubmit(data: TCuisinesSchema) {
    if (type === "add") {
      addExecute(data);
    } else if (type === "update") {
      updateExecute({ ...data, id: initialData?.id as string });
    }
  }

  return (
    <Card className="max-w-3xl mx-auto p-6 w-full">
      <h4 className="font-semibold text-xl">
        {type === "add" ? "Add new Cuisine" : "Update cuisine"}
      </h4>
      <ActionMessage result={type === "add" ? addResult : updateResult} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="md:col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Cuisine name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the cuisine.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={addExecuting || updateExecuting ? true : false}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(regions).map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        !countries.length ||
                        (addExecuting || updateExecuting ? true : false)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                      disabled={addExecuting || updateExecuting ? true : false}
                      placeholder="Describe the cuisine"
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
              {type === "add" && (addExecuting ? "Adding..." : "Add Cuisine")}
              {type === "update" &&
                (updateExecuting ? "Updating..." : "Update Cuisine")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
