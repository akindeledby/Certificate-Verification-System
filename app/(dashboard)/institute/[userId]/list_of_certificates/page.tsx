// ==============================================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Certificate = {
  candidateName: string;
  certificateId: string;
  ipfsHash: string;
  organization: string;
  status: string;
};

export default function ViewCertificates({
  walletAddress: propWalletAddress,
}: {
  walletAddress?: string;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<
    Certificate[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const certificatesPerPage = 15;

  // Retrieve Wallet Address (from Prop or Local Storage)
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    setWalletAddress(propWalletAddress || storedAddress);
  }, [propWalletAddress]);

  // Fetch Certificates
  useEffect(() => {
    if (!walletAddress) return;

    const fetchCertificates = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/getCertificatesPerUser?walletAddress=${walletAddress}&page=${currentPage}`
        );
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch certificates");

        setCertificates(data.certificates);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Could not load certificates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [walletAddress, currentPage]);

  // Filter Certificates based on Search Query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCertificates(certificates);
      return;
    }

    setFilteredCertificates(
      certificates.filter(
        (cert) =>
          cert.candidateName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          cert.certificateId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          cert.ipfsHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.organization.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [certificates, searchQuery]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Uploaded Certificates</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Certificate ID, IPFS Hash, or Organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {loading ? (
        <p>Loading certificates...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredCertificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Candidate Name</th>
                <th className="p-3 border">Certificate ID</th>
                <th className="p-3 border">IPFS Hash - Click to view</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert) => (
                <tr key={cert.certificateId} className="hover:bg-gray-100">
                  <td className="p-3 border">{cert.candidateName}</td>
                  <td className="p-3 border">{cert.certificateId}</td>
                  <td className="p-3 border">
                    <Link
                      href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      {cert.ipfsHash.substring(0, 10)}...
                    </Link>
                  </td>
                  <td className="p-3 border font-semibold">{cert.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
