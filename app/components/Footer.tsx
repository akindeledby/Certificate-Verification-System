"use client";

import React from "react";
import Style from "../styles/HomePage.module.css";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className={Style.footer}>
      <div className={Style.footer_box}>
        {/* System Information */}
        <div className={Style.footer_info}>
          <h2 className="font-bold text-lg">
            BLOCKCHAIN-BASED CERTIFICATE VERIFICATION SYSTEM
          </h2>
          <p>
            The World&apos;s First, Largest, and Trusted Blockchain-Based
            Certification Verification and Management System.
          </p>
        </div>

        {/* Newsletter Subscription */}
        <div className={Style.subscribe_box}>
          <h3 className="font-bold text-lg">Subscribe to our newsletter:</h3>
          <div className={Style.subscribe_box_input}>
            <input type="email" placeholder="Enter Your Email *" />
            <RiSendPlaneFill className={Style.subscribe_box_send} />
          </div>
          <div className={Style.subscribe_box_info}>
            <p>
              Get ahead and never let unskilled employees use falsified
              credentials to the detriment of your organization. Act now!
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="font-bold text-lg">Contact Us:</h3>
          <h4>
            Emergency, Crisis &amp; Disaster Risk Management Institute (ECRMI)
          </h4>
          <p>
            3rd Floor, Left Wing, Bamboo Plaza, 6/8 Ogunnuisi Road, opposite
            NNPC Filling Station, Hotel B/Stop, Omole Phase 1, Ojodu, Lagos,
            Nigeria.
          </p>
          <p>+234-8039392687, +234-8168570185</p>
        </div>

        {/* Social & Branding */}
        <div className={Style.footer_box_social}>
          <h3 className="font-bold text-lg">Powered by:</h3>
          <h4 className="ml-2">Matrax Systems and IT Services</h4>
          <Image src="/logo.png" alt="footer logo" height={50} width={150} />
          <div className={Style.footer_social}>
            <a href="#" aria-label="Facebook">
              <TiSocialFacebook />
            </a>
            <a href="#" aria-label="Twitter">
              <TiSocialTwitter />
            </a>
            <a href="#" aria-label="LinkedIn">
              <TiSocialLinkedin />
            </a>
            <a href="#" aria-label="Instagram">
              <TiSocialInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <TiSocialYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
