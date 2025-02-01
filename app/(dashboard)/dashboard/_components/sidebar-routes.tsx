"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import path from "path";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const adminRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/admin",
  },

  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const instituteRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },

  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const verifierRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },

  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.includes("/admin");

  const routes = isAdminPage ? adminRoutes : instituteRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
