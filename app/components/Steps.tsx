"use client";

import React from "react";
import Style from "../styles/HomePage.module.css";

interface StepItem {
  step: number;
  title: string;
  description: string;
}

const stepsData: StepItem[] = [
  {
    step: 1,
    title: "Click on Search Certificate:",
    description:
      "Click on the &quot;Search/Verify a Certificate&quot; button. This will redirect you to another page.",
  },
  {
    step: 2,
    title: "Enter your bank card details:",
    description:
      "At the payment page, enter the details of your credit/debit card.",
  },
  {
    step: 3,
    title: "Payment confirmation:",
    description: "Wait some seconds while the system confirms the payment.",
  },
  {
    step: 4,
    title: "Type the certificate or credential ID:",
    description:
      "After payment is confirmed, type in the certificate or credential ID and press the search button.",
  },
  {
    step: 5,
    title: "Search and Get Result:",
    description:
      "Relax, and wait some seconds while the system returns if the certificate is verified or not.",
  },
];

const Steps: React.FC = () => {
  return (
    <div className={Style.steps}>
      <div className={Style.steps_heading}>
        <h1>Steps to verify a Credential:</h1>
      </div>
      <div className="flex flex-col items-center md:flex-row md:gap-x-4 border-b-amber-800">
        {stepsData.map(({ step, title, description }) => (
          <div key={step} className={Style.steps_box_item}>
            <p className={Style.steps_box_item_step}>
              <span>Step {step}</span>
            </p>
            <h3 className="text-lg font-semibold pb-2 text-center">{title}</h3>
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
