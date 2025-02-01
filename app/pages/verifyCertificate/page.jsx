"use client";
import React, { useState } from "react";
import Search from "../../components/Search";
import Style from "../../styles/verifyCertificate.module.css";
//import { Button } from "../../components/ui/button";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { GrCurrency } from "react-icons/gr";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const verifyCertificate = () => {
  const [search, setSearch] = useState(false);

  const openSearch = () => {
    if (!search) {
      setSearch(true);
    } else {
      setSearch(false);
    }
  };

  return (
    <div>
      <div className={Style.top_menu}>
        <div className={Style.home}>
          <button>
            <Link href="/">
              <BsArrowLeftCircleFill className={Style.home_icon} />
              <span>Home</span>
            </Link>
          </button>
        </div>
        <div className={Style.payment_button}>
          <button className="text-white bg-blue-700 hover:bg-gray-500">
            Make a Payment
          </button>
        </div>
      </div>
      <div className={Style.verify}>
        <div className={Style.steps}>
          <h3>Steps to follow to search or verify a certificate:</h3>
          <p>1. Click on the "Make Payment" button</p>
          <p>
            2. Enter your card details and click on "Submit" and wait some
            seconds for the process to complete
          </p>
          <p>
            3. After the payment is completed and confirmed, the search feature
            will now be available
          </p>
          <p>
            4. Now, click on the Search/Verify Certificate and then enter the
            Certificate or Credential ID in the search bar
          </p>
          <p>
            5. Finally, click on "Search Icon" and wait while the system search
            and return result
          </p>
        </div>
        <div>
          <Image
            src="/verify1.png"
            alt="verification process"
            height={250}
            width={800}
          />
        </div>
      </div>
      <div className={Style.search_box}>
        <div className={Style.search_button} onClick={() => openSearch()}>
          <FiLock />
          <span>Search/Verify Certificate</span>{" "}
          {search ? <FaAngleDown /> : <FaAngleUp />}
        </div>
      </div>

      {search && (
        <div className={Style.search}>
          <div className={Style.search_box_items}>
            <Search />
          </div>
        </div>
      )}
    </div>
  );
};
export default verifyCertificate;
