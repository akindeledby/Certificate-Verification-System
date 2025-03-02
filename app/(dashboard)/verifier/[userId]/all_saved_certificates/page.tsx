"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SavedCertificate {
  candidateName: string;
  certificateId: string;
  ipfsHash: string;
  savedAt: string;
  status: string;
}

export default function SavedCertificates() {
  const [certificates, setCertificates] = useState<SavedCertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
      fetchSavedCertificates(storedWallet);
    } else {
      setError("Wallet not connected. Please connect your wallet.");
    }
  }, []);

  const fetchSavedCertificates = async (wallet: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/getSavedCertificates?walletAddress=${wallet}`
      );
      const data = await response.json();

      if (response.ok) {
        setCertificates(data);
      } else {
        setError(data.error || "Failed to load saved certificates.");
      }
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center">Saved Certificates</h2>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      {loading ? (
        <div className="flex justify-center mt-4">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : certificates.length > 0 ? (
        <div className="mt-6 space-y-4">
          {certificates.map((cert, idx) => (
            <Card key={idx} className="shadow-sm border">
              <CardContent className="p-4">
                <p className="font-semibold">Candidate: {cert.candidateName}</p>
                <p className="text-sm text-gray-600">
                  Certificate ID: {cert.certificateId}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      cert.status === "REVOKED"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {cert.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Saved On: {new Date(cert.savedAt).toLocaleString()}
                </p>
                <a
                  href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline block mt-2"
                >
                  View Certificate
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4 text-gray-600">
          No saved certificates found.
        </p>
      )}
    </div>
  );
}
