import React from "react";
import Style from "../styles/HomePage.module.css";
import Link from "next/link";

const About = () => {
  return (
    <div className={Style.about_box}>
      <div className="w-full p-4">
        <div className={Style.about}>
          <h3>About the System:</h3>
        </div>
        <div className={Style.about_info}>
          <p className="text-sm md:font-medium md:text-base mt-3">
            Counterfeit academic certificates have been a longstanding issue in
            the academic community. Certificate Verification is the process of
            verifying a certificate issued by an institution and verifying that
            it is genuine and authentic.
          </p>
          <p className="text-sm md:font-medium md:text-base mt-3">
            This system uses Blockchain storage and technology to store and
            verify certificates and credentials. Prospective employers and
            contracting organizations can use the power of this system to verify
            the genuiness or authenticity of any certificate issued by our
            institution. Blockchain is a decentralized and distributed
            technology architecture with high potential and integral database
            that opens the door to a variety of benefits to almost every field
            including the education sector. It..
            <small>
              <a href="/pages/howItWorks">[Read more]</a>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
