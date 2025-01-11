"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FiGithub } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authSchema, TAuthSchema } from "@/app/_actions/users/schema";
import Link from "next/link";
import { AuthFormType } from "@/app/auth/page";
import { Dispatch, SetStateAction } from "react";
import { useAction } from "next-safe-action/hooks";
import { registerAction } from "@/app/_actions/users";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ActionMessage from "../common/action-message";

type LoginSocialType = "google" | "github";

export interface AuthFormProps {
  type: AuthFormType;
  setType: Dispatch<SetStateAction<AuthFormType>>;
}

const AuthForm = ({ type, setType }: AuthFormProps) => {
  const { toast } = useToast();

  const { execute, isExecuting, result } = useAction(registerAction, {
    onSuccess: ({ data }) => {
      toast({
        title: "Register success!",
        description: format(new Date(), "MMMM do, yyyy"),
      });
    },
    onError: ({ error }) => {
      console.log(error);
      toast({
        title: "Register failed!",
        description: format(new Date(), "MMMM do, yyyy"),
      });
    },
  });

  const form = useForm<TAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSocialLogin = (type: LoginSocialType) => {
    signIn(type);
  };

  const onSubmit = async (values: TAuthSchema) => {
    if (type === "LOGIN") {
      await signIn("credentials", {
        ...values,
        redirectTo: "/",
      });
    } else if (type === "REGISTER") {
      execute({ email: values.email, password: values.password });
      setType("LOGIN");
    } else {
      return;
    }
  };

  const isLogin = type === "LOGIN";
  const title = isLogin ? "Welcome back!" : "Create your new account!";
  const description = isLogin
    ? "Login to your Recipes account"
    : "Create account to explore Recipes";
  const buttonText = isLogin ? "Login" : "Sign up";
  const footerText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const footerLink = isLogin ? "Sign up" : "Login";
  const footerAction = () => setType(isLogin ? "REGISTER" : "LOGIN");

  return (
    <div className="p-6 md:p-8 space-y-6 w-full">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-balance text-muted-foreground text-sm">
          {description}
        </p>
      </div>
      <ActionMessage result={result} />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              disabled={form.formState.isSubmitting || isExecuting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@domain.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={form.formState.isSubmitting || isExecuting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLogin && (
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Link
                    href="#"
                    className="ml-auto text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              variant="default"
              disabled={form.formState.isSubmitting || isExecuting}
            >
              {form.formState.isSubmitting || isExecuting ? (
                <span>{buttonText}...</span>
              ) : (
                buttonText
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <div className="grid gap-4">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => handleSocialLogin("google")}
        >
          <FcGoogle />
          <span>{buttonText} with Google</span>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={() => handleSocialLogin("github")}
        >
          <FiGithub />
          <span>{buttonText} with Github</span>
        </Button>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        <span>{footerText} </span>
        <a href="#" onClick={footerAction}>
          {footerLink}
        </a>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default AuthForm;
