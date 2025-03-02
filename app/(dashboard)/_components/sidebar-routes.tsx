"use client";

import {
  BarChart,
  BookOpenText,
  Server,
  ShieldCheck,
  UserRoundCog,
  CloudUpload,
  Search,
  Layout,
  EyeOff,
  BookCheck,
  List,
  Newspaper,
  ArrowBigUpDash,
  CheckCircle,
  SlidersVertical,
} from "lucide-react";

import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Role-based route definitions
const roleSpecificRoutes = {
  admin: (userId: string) => [
    {
      icon: Layout,
      label: "Dashboard Overview",
      href: `/admin/${userId}/dashboard`,
    },
    { icon: Server, label: "Onboarding", href: `/admin/${userId}/onboarding` },
    {
      icon: CloudUpload,
      label: "Upload Certificate",
      href: `/admin/${userId}/create_upload_certificate`,
    },
    {
      icon: Newspaper,
      label: "All Certificates",
      href: "/admin/all_certificates",
    },
    {
      icon: UserRoundCog,
      label: "User Management",
      href: "/admin/user_management",
    },
    {
      icon: List,
      label: "All Organizations",
      href: "/admin/list_of_organizations",
    },
    {
      icon: ShieldCheck,
      label: "Fraud Detection",
      href: "/admin/fraud_detection",
    },
    {
      icon: EyeOff,
      label: "Security & Access Control",
      href: "/admin/access_control",
    },
    {
      icon: BarChart,
      label: "Reports & Analytics",
      href: `/admin/${userId}/reports_analytics`,
    },
    {
      icon: SlidersVertical,
      label: "Customization & Settings",
      href: `/admin/${userId}/settings`,
    },
  ],

  institute: (userId: string) => [
    {
      icon: Layout,
      label: "Dashboard Overview",
      href: `/institute/${userId}/dashboard`,
    },
    {
      icon: CloudUpload,
      label: "Upload Certificate",
      href: `/institute/${userId}/create_upload_certificate`,
    },
    {
      icon: List,
      label: "List of Certificates",
      href: `/institute/${userId}/list_of_certificates`,
    },
    {
      icon: Newspaper,
      label: "Certificate Management",
      href: `/institute/${userId}/manage_certificates`,
    },
    {
      icon: ShieldCheck,
      label: "Fraud Detection & Alerts",
      href: "/fraud_detection",
    },
    {
      icon: BarChart,
      label: "Reports & Analytics",
      href: `/institute/${userId}/reports_analytics`,
    },
    {
      icon: SlidersVertical,
      label: "Customization & Settings",
      href: `/institute/${userId}/settings`,
    },
  ],

  verifier: (userId: string) => [
    {
      icon: Layout,
      label: "Dashboard Overview",
      href: `/verifier/${userId}/dashboard`,
    },
    {
      icon: BookCheck,
      label: "Verify Certificate",
      href: `/verifier/${userId}/verify_certificate`,
    },
    {
      icon: CheckCircle,
      label: "Saved Certificates",
      href: `/verifier/${userId}/all_saved_certificates`,
    },
    {
      icon: ShieldCheck,
      label: "Fraud Detection & Alerts",
      href: "/fraud_detection",
    },
    {
      icon: BarChart,
      label: "Reports & Analytics",
      href: `/verifier/${userId}/reports_analytics`,
    },
    {
      icon: SlidersVertical,
      label: "Customization & Settings",
      href: `/verifier/${userId}/settings`,
    },
    { icon: ArrowBigUpDash, label: "Upgrade my status", href: "" },
  ],

  guest: () => [
    { icon: Layout, label: "Dashboard Overview", href: "/guest/dashboard" },
    {
      icon: BookOpenText,
      label: "Read the docs",
      href: "/guest/read_the_docs",
    },
    { icon: BookCheck, label: "View verified certificates", href: "" },
    { icon: ArrowBigUpDash, label: "Upgrade my status", href: "" },
  ],
} as const;

const SidebarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  // Determine the user's role from the URL
  const role = pathname?.includes("/admin")
    ? "admin"
    : pathname?.includes("/institute")
    ? "institute"
    : pathname?.includes("/verifier")
    ? "verifier"
    : "guest";

  // Get the appropriate routes based on the user's role
  const routes = roleSpecificRoutes[role](userId || "guest");

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
