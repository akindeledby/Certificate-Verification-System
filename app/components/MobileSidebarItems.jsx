"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Style from "../styles/HomePage.module.css";
import { Button } from "../../components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";

const MobileSidebarItems = () => {
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
