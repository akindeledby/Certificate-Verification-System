"use client";

import { useState, useEffect } from "react";

const PAGE_SIZE = 10; // Number of certificates per page

const AllCertificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCertificates(currentPage);
  }, [currentPage]);

  const fetchCertificates = async (page: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/getAllCertificates?page=${page}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      setCertificates(data.certificates);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center">
        All Uploaded Certificates
      </h2>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <button
        onClick={() => fetchCertificates(currentPage)}
        className="w-full bg-blue-600 text-white p-2 rounded mt-4"
      >
        Refresh Data
      </button>

      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : (
        <>
          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Candidate Name</th>
                <th className="border p-2">Certificate ID</th>
                <th className="border p-2">IPFS Hash Link</th>
                <th className="border p-2">Organization / Issuer</th>
                <th className="border p-2">Uploaded On</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, idx) => (
                <tr key={idx} className="border">
                  <td className="border p-2">
                    {cert.candidateName || "Unknown"}
                  </td>
                  <td className="border p-2">{cert.certificateId || "N/A"}</td>
                  <td className="border p-2">
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Certificate
                    </a>
                  </td>
                  <td className="border p-2">
                    {cert.organization || "Unknown"}
                  </td>
                  <td className="border p-2">
                    {cert.createdAt
                      ? new Date(cert.createdAt).toLocaleString()
                      : "Unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-gray-400" : "bg-blue-600 text-white"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-200 rounded">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400"
                  : "bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllCertificates;
