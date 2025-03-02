// ========================================================================================
"use client";

import { useState } from "react";

const VerifyCertificates = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificateData, setCertificateData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID.");
      setCertificateData(null);
      return;
    }

    setLoading(true);
    setError("");
    setCertificateData(null);

    try {
      const response = await fetch(
        `/api/getCertificateData?certificateId=${encodeURIComponent(
          certificateId
        )}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch certificate.");
      }

      setCertificateData(data.certificateData);
    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.message || "Could not verify the certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Verify Certificate
      </h2>

      <input
        type="text"
        placeholder="Enter Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
        className="w-full p-3 border rounded mt-4 focus:ring focus:ring-blue-300"
      />

      <button
        onClick={handleVerify}
        className={`w-full p-3 mt-4 text-white rounded ${
          !certificateId.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={!certificateId.trim() || loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {certificateData && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <p className="font-semibold">Certificate Found:</p>
          <pre className="break-all">{certificateData}</pre>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificates;

// ==============================================================================================

// "use client";

// import { useState, useCallback } from "react";

// const VerifyCertificates = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleVerify = useCallback(async () => {
//     if (!searchQuery.trim()) {
//       setError("Please enter a candidate name or certificate ID.");
//       setIpfsUrl(null);
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setIpfsUrl(null);

//     try {
//       const response = await fetch(
//         `/api/getCertificateData?query=${encodeURIComponent(searchQuery)}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Certificate not found.");
//       }

//       setIpfsUrl(
//         `https://gateway.pinata.cloud/ipfs/${data.certificate.ipfsHash}`
//       );
//     } catch (err) {
//       console.error("Verification Error:", err);
//       setError(err.message || "Could not verify the certificate.");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchQuery]);

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold text-center text-gray-800">
//         Verify Certificate
//       </h2>

//       <input
//         type="text"
//         placeholder="Enter Candidate Name or Certificate ID"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="w-full p-3 border rounded mt-4 focus:ring focus:ring-blue-300"
//       />

//       <button
//         onClick={handleVerify}
//         className={`w-full p-3 mt-4 text-white rounded ${
//           !searchQuery.trim()
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//         disabled={!searchQuery.trim() || loading}
//       >
//         {loading ? "Verifying..." : "Verify"}
//       </button>

//       {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

//       {ipfsUrl && (
//         <div className="mt-4 p-3 border rounded bg-gray-100">
//           <p className="font-semibold">Certificate Found:</p>
//           <a
//             href={ipfsUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 underline break-all"
//           >
//             View Certificate
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyCertificates;
