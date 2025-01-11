"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { TUserSchema, userSchema } from "@/app/_actions/users/schema";
import { useAction } from "next-safe-action/hooks";
import { updateUserAction } from "@/app/_actions/users";
import ActionMessage from "@/components/common/action-message";
import { format } from "date-fns";
import UploadWidget from "@/components/common/upload-widget";

export function ProfileForm() {
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const { execute, isExecuting, result } = useAction(updateUserAction, {
    onSuccess: ({ data }) => {
      toast({
        title: "Profile updated!",
        description: format(new Date(), "MMMM do, yyyy"),
      });
      update();
    },
  });
  const form = useForm<TUserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: session?.user.email || "",
      bio: session?.user.bio || "",
      image: session?.user.image || "",
      name: session?.user.name || "",
      id: session?.user.id,
    },
  });

  async function onSubmit(data: TUserSchema) {
    execute(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <ActionMessage result={result} />
        <div className="grid lg:grid-cols-4 grid-cols-1 lg:gap-8 gap-4 w-full">
          <div className="md:col-span-1 col-span-full">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <UploadWidget
                      value={field.value || ""}
                      disabled={isExecuting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-3 col-span-1 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isExecuting ? true : false}
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
                  </FormControl>
                  <FormDescription>This is your contact email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isExecuting ? true : false}
                      placeholder="Tell us about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description about yourself (max 160 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isExecuting ? true : false}>
              {isExecuting ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
