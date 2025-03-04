"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Style from "../styles/HomePage.module.css";
import { Button } from "../../components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";

const MobileSidebarItems = () => {
  const { userId } = useAuth();
  const isAuth = Boolean(userId);
  const [loading, setLoading] = useState(false);

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
    <div>
      <div className="flex items-center justify-between">
        <Image
          src="/ECRMI_logo.png"
          alt="logo"
          className="sm:h-50 sm:w-50 md:h-150 md:h-150"
          height={150}
          width={150}
        />
      </div>
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

      <div className="border-b-2 border-t-2 border-t-amber-800 border-b-amber-800">
        <Link href="/pages/howItWorks">
          <button
            className={`${Style.navbar_container_top_home} ml-1 mt-3 mb-3 font-thin md:font-light`}
          >
            About
          </button>
        </Link>
      </div>

      <div className="border-b-2 border-t-2 border-b-amber-800">
        <Link href="/pages/howItWorks">
          <button
            className={`${Style.navbar_container_top_home} ml-1 mt-3 mb-3 font-thin md:font-light`}
          >
            Contact Us
          </button>
        </Link>
      </div>

      <div className="border-b-2 border-t-2 border-b-amber-800">
        <div>
          <Link href="/pages/howItWorks">
            <button
              className={`${Style.navbar_container_top_home} ml-1 mt-3 mb-3 font-thin md:font-light`}
            >
              Documentation
            </button>
          </Link>
        </div>
      </div>

      <div className="border-b-2 border-t-2 border-b-amber-800">
        <Button
          className="ml-1 mt-3 mb-3 text-white bg-blue-700 hover:bg-gray-500"
          variant="outline"
          size="lg"
          onClick=""
        >
          Make a Payment
        </Button>
      </div>
    </div>
  );
};

export default MobileSidebarItems;
