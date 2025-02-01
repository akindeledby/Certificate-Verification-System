import React from "react";
import Image from "next/image";
import Link from "next/link";
import Style from "../styles/HomePage.module.css";
import { Button } from "../../components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";
import { MobileSidebar } from "./MobileSidebar";

import { auth } from "@clerk/nextjs/server";

const NavBar = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="flex flex-row items-center sm:gap-x-2 md:gap-x-10 bg-lime-300 rounded-sm">
      <div className="flex h-30 justify-center items-center gap-x-2 md:gap-x-10 md:h-full md:w-full pt-0">
        <Image
          src="/ECRMI_logo.png"
          alt="logo"
          className="sm:h-50 sm:w-50 md:h-50 md:w-50"
          height={150}
          width={150}
        />
        <h2 className="text-sm md:text-3xl font-medium font-sans ">
          Blockchain-Based Certificate <br /> Verification and Management
          System.
        </h2>
      </div>
      <div className="hidden md:w-full md:flex md:gap-5 transition-all ease-in md:items-center md:justify-end md:pr-10">
        <div>
          <Link href="/pages/howItWorks">
            <button
              className={`${Style.navbar_container_top_home} font-thin md:font-light`}
            >
              About
            </button>
          </Link>
        </div>
        <div>
          {!isAuth ? (
            <div>
              <Link href="/sign-in">
                <button
                  className={`${Style.navbar_container_top_home} font-thin md:font-light`}
                >
                  Sign In
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-row gap-3 items-center">
              <Link href="/pages/dashboard">
                <div className={Style.navbar_container_top_home}>
                  Click to view Dashboard
                </div>
              </Link>
              <div>
                <UserButton />
              </div>
            </div>
          )}
          <div></div>
          <div></div>
        </div>
        <div>
          <Button
            className="text-white bg-blue-700 hover:bg-gray-500"
            variant="outline"
            size="lg"
            onClick=""
          >
            Make a Payment
          </Button>
        </div>
      </div>
      <div className="ml-auto">
        <MobileSidebar />
      </div>
    </div>
  );
};

export default NavBar;
