"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import AuthForm from "@/components/auth/auth-form";
import { useState } from "react";

export type AuthFormType = "LOGIN" | "REGISTER";

const AuthPage = () => {
  const [type, setType] = useState<AuthFormType>("LOGIN");

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-96">
          <AuthForm type={type} setType={setType} />
          <div className="relative hidden md:block">
            <Image
              fill
              src="/auth-login.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
