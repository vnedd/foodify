"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const { data } = useSession();
  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src={data?.user.image || data?.user.name || "avatar.jpg"}
          alt={data?.user.name || "user avatar"}
        />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{data?.user.name}</span>
        <span className="truncate text-xs">{data?.user.email}</span>
      </div>
    </div>
  );
};

export default UserAvatar;
