"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, Layers, TrendingUp } from "lucide-react";

const GuestDashboard = () => {
  const router = useRouter();

  const blockchainBenefits = [
    {
      icon: <ShieldCheck className="text-green-500 w-12 h-12" />,
      title: "Tamper-Proof Security",
      description:
        "Certificates stored on the blockchain cannot be altered, ensuring authenticity.",
    },
    {
      icon: <FileText className="text-blue-500 w-12 h-12" />,
      title: "Easy Verification",
      description:
        "Verifiers can instantly check a certificate's authenticity using blockchain records.",
    },
    {
      icon: <Layers className="text-purple-500 w-12 h-12" />,
      title: "Decentralization",
      description:
        "No single entity controls the records, making them trustworthy and transparent.",
    },
    {
      icon: <TrendingUp className="text-yellow-500 w-12 h-12" />,
      title: "Permanent & Accessible",
      description:
        "Certificates remain available forever and can be verified from anywhere.",
    },
  ];

  const upgradeReasons = [
    {
      role: "Institute",
      benefits: [
        "Issue blockchain-secured certificates.",
        "Prevent fraud with transparent verification.",
        "Build trust with students and employers.",
      ],
      action: () => router.push("/register/institute"),
    },
    {
      role: "Verifier",
      benefits: [
        "Easily verify certificates with blockchain records.",
        "Reduce fraud by detecting fake credentials.",
        "Ensure compliance with secure verification.",
      ],
      action: () => router.push("/register/verifier"),
    },
  ];

  return (
    <div className="p-6 grid gap-6">
      <h2 className="text-3xl font-bold text-center">
        Welcome to the Future of Certificate Verification
      </h2>
      <p className="text-center text-gray-600">
        Discover how blockchain technology enhances security and transparency.
      </p>

      {/* Blockchain Benefits Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {blockchainBenefits.map((benefit) => (
          <Card key={benefit.title} className="p-4 flex items-center space-x-4">
            {benefit.icon}
            <div>
              <p className="text-lg font-semibold">{benefit.title}</p>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Why Upgrade Section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Upgrade Your Status?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upgradeReasons.map((upgrade) => (
              <div
                key={upgrade.role}
                className="border p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold">{upgrade.role} Benefits</h3>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  {upgrade.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
                <Button className="mt-4 w-full" onClick={upgrade.action}>
                  Upgrade to {upgrade.role}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestDashboard;
