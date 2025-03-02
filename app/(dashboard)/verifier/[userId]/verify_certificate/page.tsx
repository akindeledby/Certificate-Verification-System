// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Loader2 } from "lucide-react";
// import { ethers } from "ethers";

// interface Certificate {
//   candidateName: string;
//   certificateId: string;
//   organization: string;
//   ipfsHash: string;
//   status: string;
// }

// export default function CertificateSearch() {
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [certificateId, setCertificateId] = useState("");
//   const [candidateName, setCandidateName] = useState("");
//   const [certificate, setCertificate] = useState<Certificate | null>(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [checkingWallet, setCheckingWallet] = useState(true);

//   useEffect(() => {
//     const checkWalletConnection = async () => {
//       const storedWallet = localStorage.getItem("walletAddress");
//       if (storedWallet) {
//         setWalletAddress(storedWallet);
//         setCheckingWallet(false);
//         return;
//       }
//       if (window.ethereum) {
//         try {
//           const provider = new ethers.providers.Web3Provider(window.ethereum);
//           const accounts = await provider.listAccounts();
//           if (accounts.length > 0) {
//             setWalletAddress(accounts[0]);
//             localStorage.setItem("walletAddress", accounts[0]);
//           }
//         } catch (error) {
//           console.error("Error checking wallet connection:", error);
//         }
//       }
//       setCheckingWallet(false);
//     };

//     checkWalletConnection();
//   }, []);

//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const accounts = await provider.send("eth_requestAccounts", []);
//         const address = accounts[0];
//         setWalletAddress(address);
//         localStorage.setItem("walletAddress", address);
//       } catch (error) {
//         console.error("Error connecting wallet:", error);
//       }
//     } else {
//       alert("Please install MetaMask to connect your wallet.");
//     }
//   };

//   const handleSearch = async () => {
//     if (!walletAddress) {
//       alert("Please connect your wallet first.");
//       return;
//     }

//     setError("");
//     setCertificate(null);
//     setLoading(true);

//     const queryParams = new URLSearchParams();
//     if (certificateId) queryParams.append("certificateId", certificateId);
//     if (candidateName) queryParams.append("candidateName", candidateName);

//     try {
//       const response = await fetch(
//         `/api/certificateFromDatabase?${queryParams.toString()}`
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setCertificate(data as Certificate);
//       } else {
//         setError(data.message || "Certificate not found");
//       }
//     } catch (err) {
//       setError("Error fetching certificate. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveCertificate = async (certificateId: string) => {
//     try {
//       if (!walletAddress) {
//         alert("Wallet address not found. Please connect your wallet.");
//         return;
//       }

//       const response = await fetch("/api/saveCertificate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ certificateId, walletAddress, candidateName }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert("Certificate saved successfully!");
//       } else {
//         alert(data.error || "Failed to save certificate");
//       }
//     } catch (error) {
//       console.error("Error saving certificate:", error);
//     }
//   };

//   if (checkingWallet) {
//     return <p className="p-4 text-xl">Checking wallet connection...</p>;
//   }

//   if (!walletAddress) {
//     return (
//       <div className="p-4 text-center">
//         <h2 className="text-xl font-bold mb-4">Please Connect Your Wallet</h2>
//         <Button onClick={connectWallet}>Connect Wallet</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Search Certificate</h2>
//       <div className="flex flex-col gap-2 mb-4">
//         <p>Connected Wallet: {walletAddress}</p>
//         <div className="flex gap-2">
//           <Input
//             type="text"
//             placeholder="Enter Candidate First/Last Name"
//             value={candidateName}
//             onChange={(e) => setCandidateName(e.target.value)}
//           />
//           <Input
//             type="text"
//             placeholder="Enter Certificate ID"
//             value={certificateId}
//             onChange={(e) => setCertificateId(e.target.value)}
//           />
//           <Button onClick={handleSearch} disabled={loading}>
//             {loading ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               "Search"
//             )}
//           </Button>
//         </div>
//       </div>

//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {certificate && (
//         <Card className="mt-4">
//           <CardContent>
//             <div className="mb-4">
//               <p>
//                 <strong>Issuer:</strong> {certificate.organization}
//               </p>
//               <p>
//                 <strong>IPFS Link:</strong>{" "}
//                 <a
//                   href={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   View Certificate
//                 </a>
//               </p>
//             </div>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Candidate Name</TableHead>
//                   <TableHead>Certificate ID</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell>{certificate.candidateName}</TableCell>
//                   <TableCell>{certificate.certificateId}</TableCell>
//                   <TableCell
//                     className={
//                       certificate.status === "REVOKED"
//                         ? "text-red-600 font-bold"
//                         : "text-green-600 font-bold"
//                     }
//                   >
//                     {certificate.status === "REVOKED" ? "Revoked" : "Genuine"}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//             <div>
//               <Button
//                 onClick={() => saveCertificate(certificate.certificateId)}
//                 className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Save certificate
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";

interface Certificate {
  candidateName: string;
  certificateId: string;
  organization: string;
  ipfsHash: string;
  status: string;
}

export default function CertificateSearch() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [certificateId, setCertificateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingWallet, setCheckingWallet] = useState(true);

  useEffect(() => {
    const checkWalletConnection = async () => {
      const storedWallet = localStorage.getItem("walletAddress");
      if (storedWallet) {
        setWalletAddress(storedWallet);
        setCheckingWallet(false);
        return;
      }
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            localStorage.setItem("walletAddress", accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
      setCheckingWallet(false);
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  const handleSearch = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    setError("");
    setCertificate(null);
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (certificateId) queryParams.append("certificateId", certificateId);
    if (candidateName) queryParams.append("candidateName", candidateName);

    try {
      const response = await fetch(
        `/api/certificateFromDatabase?${queryParams.toString()}`
      );
      const data = await response.json();
      if (response.ok) {
        setCertificate(data as Certificate);
      } else {
        setError(data.message || "Certificate not found");
      }
    } catch (err) {
      setError("Error fetching certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveCertificate = async () => {
    try {
      if (!walletAddress || !certificate) {
        alert("Missing wallet address or certificate data. Please try again.");
        return;
      }

      const response = await fetch("/api/saveCertificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          certificateId: certificate.certificateId,
          candidateName: certificate.candidateName,
          ipfsHash: certificate.ipfsHash,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Certificate saved successfully!");
      } else {
        alert(data.error || "Failed to save certificate");
      }
    } catch (error) {
      console.error("Error saving certificate:", error);
    }
  };

  if (checkingWallet) {
    return <p className="p-4 text-xl">Checking wallet connection...</p>;
  }

  if (!walletAddress) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Please Connect Your Wallet</h2>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Certificate</h2>
      <div className="flex flex-col gap-2 mb-4">
        <p>Connected Wallet: {walletAddress}</p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter Candidate First/Last Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {certificate && (
        <Card className="mt-4">
          <CardContent>
            <div className="mb-4">
              <p>
                <strong>Issuer:</strong> {certificate.organization}
              </p>
              <p>
                <strong>IPFS Link:</strong>{" "}
                <a
                  href={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Certificate
                </a>
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{certificate.candidateName}</TableCell>
                  <TableCell>{certificate.certificateId}</TableCell>
                  <TableCell
                    className={
                      certificate.status === "REVOKED"
                        ? "text-red-600 font-bold"
                        : "text-green-600 font-bold"
                    }
                  >
                    {certificate.status === "REVOKED" ? "Revoked" : "Genuine"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div>
              <Button
                onClick={saveCertificate}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
