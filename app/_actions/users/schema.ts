import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z
    .string()
    .min(1, {
      message: "User image is required!",
    })
    .optional(),
  bio: z.string().max(160, "Bio must not exceed 160 characters").optional(),
});

export const authSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(20, "Password must be less than 20 characters"),
});

export type TUserSchema = z.infer<typeof userSchema>;
export type TAuthSchema = z.infer<typeof authSchema>;
