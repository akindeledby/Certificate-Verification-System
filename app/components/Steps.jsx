import React from "react";
import Style from "../styles/HomePage.module.css";
import Image from "next/image";

const Step = () => {
  return (
    <div className={Style.steps}>
      <div className={Style.steps_heading}>
        <h1>Steps to verify a Credential:</h1>
      </div>
      <div className="flex flex-col items-center md:flex-row md:gap-x-4 border-b-amber-800">
        <div className={Style.steps_box_item}>
          {/*<Image src={images.service1} alt="Filter & Discover" width={100} height={100} />*/}
          <p className={Style.steps_box_item_step}>
            <span>Step 1</span>
          </p>
          <h3 className="text-lg font-semibold pb-2 text-center">
            Click on Search Certificate:
          </h3>
          <p>
            Click on the "Search/Verify a Certificate" button. This will
            redirect you to another page.
          </p>
        </div>
        <div className={Style.steps_box_item}>
          {/*<Image src={images.service1} alt="Filter & Discover" width={100} height={100} />*/}
          <p className={Style.steps_box_item_step}>
            <span>Step 2</span>
          </p>
          <h3 className="text-lg font-semibold pb-2">
            Enter your bank card details:
          </h3>
          <p>
            At the payment page, enter the details of your credit/debit card.
          </p>
        </div>
        <div className={Style.steps_box_item}>
          {/*<Image src={images.service1} alt="Filter & Discover" width={100} height={100} />*/}
          <p className={Style.steps_box_item_step}>
            <span>Step 3</span>
          </p>
          <h3 className="text-lg font-semibold pb-2">Payment confirmation:</h3>
          <p>Wait some seconds while the system confirms the payment.</p>
        </div>
        <div className={Style.steps_box_item}>
          {/*<Image src={images.service1} alt="Filter & Discover" width={100} height={100} />*/}
          <p className={Style.steps_box_item_step}>
            <span>Step 4</span>
          </p>
          <h3 className="text-lg font-semibold pb-2">
            Type the certificate or credential ID:
          </h3>
          <p>
            After payment is confirmed, type in the certificate or credential ID
            and press the search button.
          </p>
        </div>
        <div className={Style.steps_box_item}>
          {/*<Image src={images.service1} alt="Filter & Discover" width={100} height={100} />*/}
          <p className={Style.steps_box_item_step}>
            <span>Step 5</span>
          </p>
          <h3 className="text-lg font-semibold pb-2">Search and Get Result:</h3>
          <p>
            Relax, and wait some second, while the system returns if certificate
            is verified or not.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step;
