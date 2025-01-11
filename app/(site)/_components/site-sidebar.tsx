"use client";

import * as React from "react";
import { LuCircleUser } from "react-icons/lu";
import { TiTag } from "react-icons/ti";
import { HiOutlineHome } from "react-icons/hi2";
import { LiaRandomSolid } from "react-icons/lia";
import { PiBowlFood } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { BiMessageSquareAdd } from "react-icons/bi";
import { LuEarth } from "react-icons/lu";
import { CgList } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";
import { MdPublishedWithChanges } from "react-icons/md";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

const SiteSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const generateNavMain = () => {
    const commonRoutes = [
      {
        title: "Home",
        url: "/",
        icon: HiOutlineHome,
        isActive: pathname === "/",
      },
      {
        title: "Recipes",
        url: "/recipes",
        icon: PiBowlFood,
        isActive: pathname === "/recipes",
      },
      {
        title: "Random food",
        url: "/random",
        icon: LiaRandomSolid,
        isActive: pathname === "/random",
        separator: true,
      },
    ];

    const loggedInRoutes = [
      {
        title: "Profile",
        url: "/profile",
        isActive: pathname === "/profile",
        icon: LuCircleUser,
      },
      {
        title: "Add new recipe",
        url: "/profile/recipe/add",
        isActive: pathname === "/profile/recipe/add",
        icon: BiMessageSquareAdd,
      },
      {
        title: "Published recipes",
        url: "/profile/published",
        isActive: pathname === "/profile/published",
        icon: MdPublishedWithChanges,
      },
      {
        title: "Saved",
        url: "/profile/saved",
        isActive: pathname === "/profile/saved",
        icon: TiTag,
        separator: true,
      },
    ];

    const adminRoutes = [
      {
        title: "Categories",
        url: "/categories",
        icon: BiCategory,
        isActive: pathname === "/categories",
      },
      {
        title: "Cuisines",
        url: "/cuisines",
        icon: LuEarth,
        isActive: pathname === "/cuisines",
      },
    ];

    if (session?.user) {
      const isAdmin = session.user.role === UserRole.ADMIN;
      return [
        ...commonRoutes,
        ...loggedInRoutes,
        ...(isAdmin ? adminRoutes : []),
      ];
    }

    return commonRoutes;
  };
  const navMain = generateNavMain();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      {session?.user && (
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
};

export default SiteSidebar;
