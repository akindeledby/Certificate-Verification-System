import React from "react";
import { Logo } from "./logo";
import SidebarRoutes from "./sidebar-routes";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div>
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
