// ==================== Corrected For SSR & CSR Deployment =================================
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

interface Certificate {
  candidateName: string;
  certificateId: string;
  status: string;
}

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCertId, setLoadingCertId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const certificatesPerPage = 10;

  // Retrieve wallet address only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWallet = localStorage.getItem("walletAddress")?.toLowerCase();
      if (storedWallet) setWalletAddress(storedWallet);
    }
  }, []);

  // Fetch certificates only when walletAddress is available
  const fetchCertificates = useCallback(
    async (page: number) => {
      if (!walletAddress) return;

      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/getCertificatesPerUser?walletAddress=${walletAddress}&page=${page}&limit=${certificatesPerPage}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch certificates");

        setCertificates(data.certificates);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Could not load certificates.");
      } finally {
        setLoading(false);
      }
    },
    [walletAddress]
  );

  // Fetch data when walletAddress or currentPage changes
  useEffect(() => {
    if (walletAddress) fetchCertificates(currentPage);
  }, [fetchCertificates, currentPage, walletAddress]);

  // Optimized filtering
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch =
        searchQuery.length === 0 ||
        cert.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "ALL" || cert.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [certificates, searchQuery, filterStatus]);

  // Toggle certificate status
  const toggleStatus = async (certificateId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ISSUED" ? "REVOKED" : "ISSUED";
    setLoadingCertId(certificateId);
    try {
      const response = await fetch("/api/updateCertificateStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId, newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.certificateId === certificateId
            ? { ...cert, status: newStatus }
            : cert
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoadingCertId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Uploaded Certificates</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name or Certificate ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/4"
        >
          <option value="ALL">All</option>
          <option value="ISSUED">Issued</option>
          <option value="REVOKED">Revoked</option>
        </select>
      </div>

      {/* Display Certificates */}
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
                <th className="p-3 border">Certificate No</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert) => (
                <tr key={cert.certificateId} className="hover:bg-gray-100">
                  <td className="p-3 border">{cert.candidateName}</td>
                  <td className="p-3 border">{cert.certificateId}</td>
                  <td className="p-3 border font-semibold">{cert.status}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() =>
                        toggleStatus(cert.certificateId, cert.status)
                      }
                      disabled={loadingCertId === cert.certificateId}
                      className={`px-4 py-2 rounded text-white flex items-center ${
                        cert.status === "ISSUED" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {loadingCertId === cert.certificateId
                        ? "Processing..."
                        : cert.status === "ISSUED"
                        ? "Revoke"
                        : "Issue"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
