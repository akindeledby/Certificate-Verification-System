import React from "react";
import Style from "../../styles/howitworks.module.css";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const howItWorks = () => {
  return (
    <div className={Style.Container}>
      <div className={Style.home}>
        <button>
          <Link href="/">
            <BsArrowLeftCircleFill />
            Home
          </Link>
        </button>
      </div>
      <div className={Style.how_top}>
        <h4>How the system works:</h4>
        <div className={Style.how}>
          <div className={Style.how_info}>
            <p>
              Counterfeit academic certificates have been a longstanding issue
              in the academic community. Certificate Verification is the process
              of verifying a certificate issued by an institution and verifying
              that it is genuine and authentic.
            </p>
            <p>
              This system uses Blockchain storage and technology to store and
              verify certificates and credentials. Prospective employers and
              contracting organizations can use the power of this system to
              verify the genuiness or authenticity of any certificate issued by
              our institution. Blockchain is a decentralized and distributed
              technology architecture with high potential and integral database
              that opens the door to a variety of benefits to almost every field
              including the education sector.
            </p>
            <p>
              The existing system or technology (private/centralized) has
              several times been proven to not solve this problem. Job
              candidates have disguised to be whom they are not or falsified
              certificate due to forged certificate and credentials, as also
              privately owned computers/servers which store electronic/digital
              certificates have been compromised to issue certificates to people
              who never merit them. Billions of dollars in cash and asset has
              been lost globally due to incompetent employees being employed
              Certificate forgery and counterfeiting globally has cost employees
              and organization losing. Academic institutions alike have had
              their reputation and credibility destroyed due to forgeries of
              their certificates and credentials by criminal individuals who
              have used them in several work places.
            </p>
            <p>
              Blockchain based certificate authentication system has created an
              avenue for solving this problems as it offers immense benefits and
              have revolutionize the education sector as well as other sectors
              bringing about security, confidentiality, as well as immutability.
              Any data, files or information stored on the blockchain remains
              permanent or unchanged and cannot be altered, deleted, modified or
              falsified This system is designed to allow educational
              institutions explore and use the Ethereum Blockchain and other
              Blockchain based storage systems to implement a solution for the
              storage and verification of educational certificates. It focuses
              on checking the authenticity and integrity of the certificates
              that have been issued.
            </p>
            <p>
              Employers, verifiers, contracting organizations and other third
              party organizations alike can as well verify the authenticity of
              any certificate by simply searching them on the system, keeping
              them a step ahead in the due diligent, and interview process. The
              database has been designed to contain two categories of data: the
              public authentication data and the private certificate data. The
              public authentication data is available to the public and released
              to the blockchain<b>(IPFS)</b> while the private certificate data
              are stored in the Database<b>(MongoDB)</b> where it is securely
              protected and isolated in the intranet.
            </p>
          </div>

          <div className={Style.how_image}>
            <Image
              src="/verify2.png"
              alt="verification process"
              height={550}
              width={650}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default howItWorks;
