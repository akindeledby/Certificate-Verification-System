"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isInstitutePage = pathname?.startsWith("/institute");
  const isVerifierPage = pathname?.includes("/verifier");
  const isAdminPage = pathname === "/admin";

  return (
    <>
      {isAdminPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isInstitutePage || isVerifierPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button size="sm" variant="destructive" className="text-white">
              Go to Home
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
