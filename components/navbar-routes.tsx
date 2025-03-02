"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import ConnectWalletButton from "../app/components/ConnectWalletButton";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isInstitutePage = pathname?.startsWith("/institute");
  const isVerifierPage = pathname?.startsWith("/verifier");
  const isGuestPage = pathname?.startsWith("/guest");

  return (
    <div className="flex items-center gap-80">
      <div>
        {/* Go To Home button (Visible for all pages) */}
        <Link href="/">
          <Button size="sm" variant="destructive" className="text-white">
            Go to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-x-2">
        {/* Show Connect Wallet button for Admin & Institute pages */}
        {/* {(isAdminPage || isInstitutePage) && <ConnectWalletButton />} */}

        <Button
          size="sm"
          variant="sky"
          className="text-white"
          onClick={() => {}}
        >
          Make a Payment
        </Button>

        {/* Exit button (Visible for all pages) */}
        <SignOutButton>
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
};
