"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import Style from "../styles/HomePage.module.css";

const Intro: React.FC = () => {
  return (
    <div className="w-90 flex flex-col gap-1 p-10 border-b-2 border-t-2 border-t-amber-800 border-b-amber-800 md:flex-row md:px-10 md:mt-2 md:pt-2">
      <div className="md:gap-x-8">
        <h1 className="font-medium text-4xl md:font-bold md:text-7xl">
          Search, Verify, and Authenticate.
        </h1>
        <p className="text-sm md:font-medium md:text-base mt-3">
          Verify the genuineness of academic certificates or credentials using
          the power of Blockchain technology. <br />
          Choosing unqualified candidates can ruin an organization&apos;s
          reputation.
        </p>

        {/* Buttons Section */}
        <div className="mt-4 space-y-3">
          <Link href="/pages/howItWorks">
            <button
              className={`${Style.intro_button} hover:bg-slate-200 transition ease-in hover:text-slate-700`}
            >
              Find out more...
            </button>
          </Link>

          <Link href="/pages/verifyCertificate">
            <button
              className={`${Style.intro_button} hover:bg-slate-200 transition ease-in hover:text-slate-700`}
            >
              Upload a Certificate
            </button>
          </Link>

          <Link href="/pages/verifyCertificate">
            <button
              className={`${Style.intro_button} hover:bg-slate-200 transition ease-in hover:text-slate-700`}
            >
              Search or Verify a Certificate
            </button>
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className={Style.intro_image_1}>
        <Image
          src="/Issue_Process.png"
          alt="Issuing Process"
          height={450}
          width={600}
          priority
        />
      </div>
    </div>
  );
};

export default Intro;
