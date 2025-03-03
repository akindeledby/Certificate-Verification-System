import React from "react";
import styles from "../styles/HomePage.module.css"; // Fixed import
import Link from "next/link";

const About = () => {
  return (
    <div className={styles.about_box}>
      <div className="w-full p-4">
        <div className={styles.about}>
          <h3>About the System:</h3>
        </div>
        <div className={styles.about_info}>
          <p className="text-sm md:font-medium md:text-base mt-3">
            Counterfeit academic certificates have been a longstanding issue in
            the academic community. Certificate Verification is the process of
            verifying a certificate issued by an institution and ensuring that
            it is genuine and authentic.
          </p>
          <p className="text-sm md:font-medium md:text-base mt-3">
            This system uses Blockchain technology to store and verify
            certificates. Prospective employers and organizations can use the
            system to verify the authenticity of any certificate issued by our
            institution. Blockchain is a decentralized and distributed
            technology that brings significant benefits to the education sector.
          </p>
          <p className="text-sm md:font-medium md:text-base mt-3">
            Learn more about how this system works:
            <Link
              href="/pages/howItWorks"
              className="text-blue-500 underline ml-1"
            >
              Read more
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
