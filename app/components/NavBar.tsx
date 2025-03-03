// =====================================================================================================
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./MobileSidebar";
import { useRouter } from "next/navigation";
import Style from "../styles/HomePage.module.css";

const NavBar: React.FC = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isAuth = Boolean(userId);

  const handleFetchRole = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/checkUserRole?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch role");

      const { redirectUrl, message } = await response.json();
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        alert(message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      alert("Failed to fetch role. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  return (
    <nav className="flex flex-row items-center sm:gap-x-2 md:gap-x-10 bg-lime-300 rounded-sm p-4">
      {/* Logo and Title */}
      <div className="flex items-center gap-x-2 md:gap-x-10">
        <Image src="/ECRMI_logo.png" alt="logo" height={100} width={100} />
        <h2 className="text-sm md:text-4xl font-medium">
          Blockchain-Based Certificate Management <br />
          and Verification System.
        </h2>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:ml-auto md:items-center gap-5">
        <Link href="/howItWorks" className={Style.navbar_container_top_home}>
          About
        </Link>
        <Link href="/documentation" className={Style.navbar_container_top_home}>
          Read the Docs
        </Link>

        {isAuth ? (
          <div className="flex items-center gap-3">
            <Button
              className={Style.navbar_container_top_home}
              onClick={handleFetchRole}
              disabled={loading}
            >
              {loading ? "Loading..." : "Go to Dashboard"}
            </Button>
            <UserButton />
          </div>
        ) : (
          <Link href="/sign-in" className={Style.navbar_container_top_home}>
            Sign In
          </Link>
        )}

        <Button className="text-white bg-blue-700 hover:bg-gray-500">
          Make a Payment
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden ml-auto">
        <MobileSidebar />
      </div>
    </nav>
  );
};

export default NavBar;
