import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
