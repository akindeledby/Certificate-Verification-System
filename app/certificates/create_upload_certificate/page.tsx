// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// import { useGlobalContext } from "@/app/context";
// import { ABI, CONTRACT_ADDRESS } from "../../contract"; // Import contract details

// const UploadCertificate = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [ipfsHash, setIpfsHash] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [candidateName, setCandidateName] = useState("");
//   const [certificateId, setCertificateId] = useState("");

//   const { walletAddress, connectWallet } = useGlobalContext();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const uploadToIPFS = async (file: File) => {
//     try {
//       const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
//       if (!pinataJWT) throw new Error("Missing Pinata API Key");

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${pinataJWT}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       return response.data.IpfsHash;
//     } catch (err) {
//       console.error("IPFS Upload Error:", err);
//       throw new Error("Failed to upload to IPFS");
//     }
//   };

//   const storeOnBlockchain = async (
//     certificateId: string,
//     ipfsHash: string,
//     candidateName: string
//   ) => {
//     if (!window.ethereum) {
//       throw new Error("MetaMask is not installed");
//     }

//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

//       // Call the smart contract function to register the certificate
//       const tx = await contract.uploadCertificate(
//         certificateId,
//         ipfsHash,
//         candidateName
//       );
//       await tx.wait(); // Wait for transaction confirmation

//       return true;
//     } catch (err) {
//       console.error("Blockchain Transaction Error:", err);
//       throw new Error("Failed to store certificate on blockchain");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!walletAddress) {
//       setError("Please connect your wallet first.");
//       return;
//     }
//     if (!file) {
//       setError("Please select a file.");
//       return;
//     }
//     if (!candidateName) {
//       setError("Please enter candidate name.");
//       return;
//     }
//     if (!certificateId) {
//       setError("Please enter certificate ID.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Upload certificate to IPFS
//       const ipfsHash = await uploadToIPFS(file);
//       setIpfsHash(ipfsHash);

//       // Store certificate on the blockchain
//       await storeOnBlockchain(certificateId, ipfsHash, candidateName);

//       alert("Certificate uploaded and registered on blockchain successfully!");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
//       <h2 className="text-2xl font-bold text-center">Upload Certificate</h2>

//       {error && <p className="text-red-500 text-center mt-2">{error}</p>}

//       {!walletAddress ? (
//         <button
//           onClick={connectWallet}
//           className="w-full bg-blue-600 text-white p-2 rounded mt-4"
//         >
//           Connect Wallet
//         </button>
//       ) : (
//         <>
//           <p className="text-center mb-4">Connected Wallet: {walletAddress}</p>

//           <form onSubmit={handleSubmit} className="mt-4">
//             <div className="mb-4">
//               <label className="block text-gray-600">Candidate Name</label>
//               <input
//                 type="text"
//                 value={candidateName}
//                 onChange={(e) => setCandidateName(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-600">Certificate ID</label>
//               <input
//                 type="text"
//                 value={certificateId}
//                 onChange={(e) => setCertificateId(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-600">
//                 Select Certificate File
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf, .jpg, .jpeg, .png"
//                 onChange={handleFileChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white p-2 rounded"
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Upload Certificate"}
//             </button>
//           </form>
//         </>
//       )}

//       {ipfsHash && (
//         <div className="mt-4 p-4 bg-gray-100 rounded">
//           <p className="text-center font-semibold">
//             Certificate Stored on IPFS:
//           </p>
//           <p className="text-center break-all text-blue-500">{ipfsHash}</p>
//           <p className="text-center mt-2">
//             <a
//               href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 underline"
//             >
//               View Certificate
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadCertificate;

// ======================================================================
"use client";

import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useGlobalContext } from "@/app/context";
import { ABI, CONTRACT_ADDRESS } from "../../contract";

const UploadCertificate = () => {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [certificateId, setCertificateId] = useState("");

  const { walletAddress, connectWallet } = useGlobalContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async (file: File) => {
    try {
      const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
      if (!pinataJWT) throw new Error("Missing Pinata API Key");

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${pinataJWT}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.IpfsHash;
    } catch (err) {
      console.error("IPFS Upload Error:", err);
      throw new Error("Failed to upload to IPFS");
    }
  };

  const storeOnBlockchain = async (
    certificateId: string,
    ipfsHash: string,
    candidateName: string
  ) => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.uploadCertificate(
        certificateId,
        ipfsHash,
        candidateName
      );
      await tx.wait();

      return true;
    } catch (err) {
      console.error("Blockchain Transaction Error:", err);
      throw new Error("Failed to store certificate on blockchain");
    }
  };

  const saveToDatabase = async (
    certificateId: string,
    ipfsHash: string,
    candidateName: string,
    issuedById: string
  ) => {
    try {
      await axios.post("/api/certificateToDatabase", {
        certificateId,
        ipfsHash,
        candidateName,
        issuedById,
      });
    } catch (err) {
      console.error("Database Insertion Error:", err);
      throw new Error("Failed to save certificate to database");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!candidateName) {
      setError("Please enter candidate name.");
      return;
    }
    if (!certificateId) {
      setError("Please enter certificate ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ipfsHash = await uploadToIPFS(file);
      setIpfsHash(ipfsHash);

      await storeOnBlockchain(certificateId, ipfsHash, candidateName);

      await saveToDatabase(
        certificateId,
        ipfsHash,
        candidateName,
        walletAddress
      );

      alert(
        "Certificate uploaded, registered on blockchain, and saved to database successfully!"
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center">Upload Certificate</h2>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white p-2 rounded mt-4"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="text-center mb-4">Connected Wallet: {walletAddress}</p>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-600">Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Certificate ID</label>
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">
                Select Certificate File
              </label>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Certificate"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UploadCertificate;
