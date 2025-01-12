"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SwitchTheme from "@/components/common/switch-theme";
import SiteSidebar from "./_components/site-sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import AppSearch from "./_components/app-search";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isSearchPage = pathname === "/recipes";
  return (
    <SidebarProvider>
      <SiteSidebar />
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center gap-2 transition-[width,height] border-b ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 pr-4">
          <div className="flex items-center gap-2 px-4 justify-between ">
            <SidebarTrigger className="-ml-1" />
          </div>
          {!isSearchPage && <AppSearch />}
          <div className="ml-auto flex items-center space-x-2">
            <SwitchTheme />
            {session?.user ? (
              <Link href={"/profile/recipe/add"}>
                <Button size={"sm"} className="h-8">
                  Create <RiAddLine />
                </Button>
              </Link>
            ) : (
              <Link href={"/auth"}>
                <Button size={"sm"} className="h-8" variant="outline">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 ">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
