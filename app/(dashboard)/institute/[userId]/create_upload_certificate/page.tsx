// // ====================================================================
// "use client";

// import { useState, useEffect, useRef } from "react";
// import axios from "axios";

// import { useGlobalContext } from "@/app/context";
// import { ethers } from "ethers";
// import { ABI, CONTRACT_ADDRESS } from "../../../../contract";
// import { jsPDF } from "jspdf";

// const UploadCertificate = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [ipfsHash, setIpfsHash] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [candidateName, setCandidateName] = useState("");
//   const [certificateId, setCertificateId] = useState("");
//   const [organization, setOrganization] = useState("");
//   const [issuedBy, setIssuedBy] = useState("");
//   const [email, setEmail] = useState("");
// const [course, setCourse] = useState("");
// const [dateIssued, setDateIssued] = useState("");
//   const [institute, setInstitute] = useState("");
//   const [view, setView] = useState("upload");
//   const [logo, setLogo] = useState<string | null>(null);
//   const [checkingWallet, setCheckingWallet] = useState(true);

//   const { walletAddress, connectWallet, setWalletAddress } = useGlobalContext();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   useEffect(() => {
//     const checkWalletConnection = async () => {
//       const storedWallet = localStorage.getItem("walletAddress");
//       if (storedWallet) {
//         setWalletAddress(storedWallet);
//       } else if (window.ethereum) {
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
//   }, [setWalletAddress]);

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

// const storeOnBlockchain = async (
//   certificateId: string,
//   ipfsHash: string,
//   candidateName: string
// ) => {
//   if (!window.ethereum) {
//     throw new Error("MetaMask is not installed");
//   }

//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

//     const tx = await contract.uploadCertificate(
//       certificateId,
//       ipfsHash,
//       candidateName
//     );
//     await tx.wait();

//     return true;
//   } catch (err) {
//     console.error("Blockchain Transaction Error:", err);
//     throw new Error("Failed to store certificate on blockchain - Ensure certificate Id is not already stored in database");
//   }
// };

//   const saveToDatabase = async (
//     certificateId: string,
//     ipfsHash: string,
// candidateName: string,
// issuedBy: string,
// organization: string
//   ) => {
//     try {
//       // const { getToken } = useAuth();
//       // const token = await getToken();
//       console.log("Sending data to API:", {
//         certificateId,
//         ipfsHash,
//         candidateName,
//         issuedBy,
//         organization,
//         status: "ISSUED",
//       });

//       const response = await axios.post(
//         "/api/certificateToDatabase",
//         {
//           certificateId,
//           ipfsHash,
//           candidateName,
//           issuedBy,
//           organization,
//           status: "ISSUED",
//         }
//         // {
//         //   headers: {
//         //     Authorization: `Bearer ${token}`,
//         //     "Content-Type": "application/json",
//         //   },
//         // }
//       );
//       console.log("API Response:", response.data);
//     } catch (err) {
//       console.error("Database Insertion Error:", err);
//       throw new Error("Failed to save to database");
//     }
//   };

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

// const resetForm = () => {
//   setFile(null);
//   setCandidateName("");
//   setCertificateId("");
//   setIpfsHash("");
//   setIssuedBy("");
//   setOrganization("");

//   if (fileInputRef.current) {
//     fileInputRef.current.value = ""; // ✅ Clears file input field
//   }
// };

// const handleSubmitUploadedCertificate = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!walletAddress) {
//     setError("Please connect your wallet first.");
//     return;
//   }
//   if (!file) {
//     setError("Please select a file.");
//     return;
//   }
//   if (!candidateName) {
//     setError("Please enter candidate name.");
//     return;
//   }
//   if (!certificateId) {
//     setError("Please enter certificate ID.");
//     return;
//   }

//   // if (!issuedBy) {
//   //   setError("Please enter issuer or institute name.");
//   //   return;
//   // }

//   setLoading(true);
//   setError("");

//   try {
//     const ipfsHash = await uploadToIPFS(file);
//     setIpfsHash(ipfsHash);

//     //await storeOnBlockchain(certificateId, ipfsHash, candidateName);
//     await saveToDatabase(
//       certificateId,
//       ipfsHash,
//       candidateName,
//       walletAddress,
//       organization
//     );

//     alert("Certificate Uploaded on Blockchain and Database Successfully!");

//     resetForm();
//   } catch (err: any) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

// const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (!file) return;

//   // Convert image to Base64
//   const reader = new FileReader();
//   reader.onloadend = () => {
//     setLogo(reader.result as string);
//   };
//   reader.readAsDataURL(file);
// };

//   const generatePDF = () => {
// if (
//   !candidateName ||
//   !certificateId ||
//   !course ||
//   !dateIssued ||
//   !institute
// ) {
//   setError("All fields are required to generate the certificate.");
//   return;
// }

// const doc = new jsPDF({
//   orientation: "landscape", // Force Landscape Mode
//   unit: "mm",
//   format: "a4",
// });

// const pageWidth = doc.internal.pageSize.getWidth();
// const pageHeight = doc.internal.pageSize.getHeight();

// // Draw the border
// doc.setDrawColor(0, 0, 255);
// doc.setLineWidth(3);
// doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // (x, y, width, height)

// const imgWidth = 35;
// const imgHeight = 35;
// const centerX = (pageWidth - imgWidth) / 2;
// const imgY = 7;
// if (logo) {
//   doc.addImage(logo, "PNG", centerX, imgY, imgWidth, imgHeight);
// }

//     doc.setFontSize(30);
//     doc.text(institute, 150, 55, { align: "center" });
//     doc.setFontSize(20);
//     doc.text(`Certificate of Completion`, 150, 75, { align: "center" });
//     doc.setFontSize(15);
//     doc.text(`This is to certify that`, 150, 90, { align: "center" });
//     doc.setFontSize(25);
//     doc.text(candidateName, 150, 105, { align: "center" });
//     doc.setFontSize(5);
//     doc.text(
//       `______________________________________________________________________________________________________`,
//       100,
//       110
//     );
//     doc.setFontSize(14);
//     doc.text(`Has successfully completed the course in`, 150, 120, {
//       align: "center",
//     });
//     doc.setFontSize(18);
//     doc.text(course, 150, 130, { align: "center" });
//     doc.setFontSize(13);
//     doc.text(`Issued on this day:`, 150, 150, {
//       align: "center",
//     });
//     doc.setFontSize(10);
//     doc.text(`${dateIssued}`, 150, 155, {
//       align: "center",
//     });
//     doc.setFontSize(12);
//     doc.text(`Certificate ID: ${certificateId}`, 230, 190);
//     doc.text(`Signed by: _____________________`, 20, 190);
//     doc.save("certificate.pdf");

//     if (doc.save("certificate")) {
//     }
//   };

//   return (
//     <>
//       <div className="text-lg font-bold mb-4 mt-4 ml-3">
//         <p>Connected Wallet: </p>
//         <p>{walletAddress}</p>
//       </div>

//       <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
//         <h2 className="text-2xl font-bold text-center">
//           {view === "upload"
//             ? "Upload a Certificate"
//             : "Generate a Certificate"}
//         </h2>

//         {error && <p className="text-red-500 text-center mt-2">{error}</p>}

//         {checkingWallet ? (
//           <button
//             onClick={connectWallet}
//             className="w-full bg-blue-600 text-white p-2 rounded mt-4"
//           >
//             Connect Wallet
//           </button>
//         ) : view === "upload" ? (
//           <>
//             <form onSubmit={handleSubmitUploadedCertificate} className="mt-4">
//               <input
//                 type="text"
//                 placeholder="Candidate Full Name"
//                 required
//                 onChange={(e) => setCandidateName(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Certificate ID"
//                 required
//                 onChange={(e) => setCertificateId(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Issuer or Institute Name"
//                 required
//                 onChange={(e) => setOrganization(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 id="fileInputRef"
//                 type="file"
//                 accept=".pdf, .jpg, .jpeg, .png"
//                 required
//                 onChange={handleFileChange}
//                 className="w-full p-2 border rounded mb-4"
//               />

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-2 rounded mb-4"
//               >
//                 {loading ? "Uploading..." : "Upload Certificate"}
//               </button>
//               {ipfsHash && (
//                 <div className="mt-4 p-4 bg-gray-100 rounded text-center">
//                   <p className="text-green-600 font-bold">Upload Successful!</p>
//                   <a
//                     href={`https://ipfs.io/ipfs/${ipfsHash}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     View Certificate
//                   </a>
//                 </div>
//               )}
//               <div className="flex align-center justify-center mb-4">
//                 <p>Or</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setView("generate")}
//                 className="w-full bg-gray-500 text-white p-2 rounded "
//               >
//                 Click here to generate a new one
//               </button>
//             </form>
//           </>
//         ) : (
//           <form className="mt-4">
//             <input
//               type="text"
//               placeholder="Candidate's Full Name"
//               required
//               onChange={(e) => setCandidateName(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//             />
//             <input
//               type="text"
//               placeholder="Certificate ID"
//               required
//               onChange={(e) => setCertificateId(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//             />
//             <input
//               type="text"
//               placeholder="Institute Name"
//               required
//               onChange={(e) => setInstitute(e.target.value)}
//               className="w-full p-2 border rounded mb-4"
//             />
// <input
//   type="text"
//   placeholder="Course of Study"
//   required
//   onChange={(e) => setCourse(e.target.value)}
//   className="w-full p-2 border rounded mb-4"
// />
// <input
//   type="text"
//   placeholder="Date Issued"
//   required
//   onChange={(e) => setDateIssued(e.target.value)}
//   className="w-full p-2 border rounded mb-4"
// />

// <div className="mb-4">
//   <label className="block text-gray-600">
//     Upload School Logo - jpeg or png
//   </label>
//   <input
//     type="file"
//     accept="image/png, image/jpeg"
//     onChange={handleLogoUpload}
//     className="w-full p-2 border rounded"
//   />
// </div>
//             <button
//               type="button"
//               onClick={generatePDF}
//               className="w-full bg-green-600 text-white p-2 rounded mb-4"
//             >
//               Generate Certificate
//             </button>
//             <button
//               type="button"
//               onClick={() => setView("upload")}
//               className="w-full bg-gray-500 text-white p-2 rounded"
//             >
//               Back to Upload Certificate
//             </button>
//           </form>
//         )}
//       </div>
//     </>
//   );
// };

// export default UploadCertificate;

// //===========================================================================
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useGlobalContext } from "@/app/context";
// import { jsPDF } from "jspdf";

// const CertificateManager = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [ipfsHash, setIpfsHash] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [candidateName, setCandidateName] = useState("");
//   const [certificateId, setCertificateId] = useState("");
//   const [organization, setOrganization] = useState("");
//   const [institute, setInstitute] = useState("");
//   const [course, setCourse] = useState("");
//   const [dateIssued, setDateIssued] = useState("");
//   const [logo, setLogo] = useState<string | null>(null);
//   const [view, setView] = useState("upload");
//   const { walletAddress, connectWallet, setWalletAddress } = useGlobalContext();

//   useEffect(() => {
//     const storedWallet = localStorage.getItem("walletAddress");
//     if (storedWallet) setWalletAddress(storedWallet);
//   }, [setWalletAddress]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
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
//         { headers: { Authorization: `Bearer ${pinataJWT}` } }
//       );

//       return response.data.IpfsHash;
//     } catch (err) {
//       console.error("IPFS Upload Error:", err);
//       throw new Error("Failed to upload to IPFS");
//     }
//   };

//   const saveToDatabase = async (certificateId: string, ipfsHash: string) => {
//     try {
//       await axios.post("/api/certificateToDatabase", {
//         certificateId,
//         ipfsHash,
//         candidateName,
//         issuedBy: walletAddress,
//         organization,
//         status: "ISSUED",
//       });
//     } catch (err) {
//       console.error("Database Insertion Error:", err);
//       throw new Error("Failed to save to database");
//     }
//   };

//   const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Convert image to Base64
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setLogo(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const generatePDF = async () => {
// if (!candidateName || !certificateId || !organization) {
//   setError("All fields are required.");
//   return;
// }
//     setLoading(true);
//     setError("");
//     const doc = new jsPDF({
//       orientation: "landscape", // Force Landscape Mode
//       unit: "mm",
//       format: "a4",
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     // Draw the border
//     doc.setDrawColor(0, 0, 255);
//     doc.setLineWidth(3);
//     doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // (x, y, width, height)

//     const imgWidth = 35;
//     const imgHeight = 35;
//     const centerX = (pageWidth - imgWidth) / 2;
//     const imgY = 7;

//     if (logo) {
//       doc.addImage(logo, "PNG", centerX, imgY, imgWidth, imgHeight);
//     }

//         doc.setFontSize(30);
//         doc.text(institute, 150, 55, { align: "center" });
//         doc.setFontSize(20);
//         doc.text(`Certificate of Completion`, 150, 75, { align: "center" });
//         doc.setFontSize(15);
//         doc.text(`This is to certify that`, 150, 90, { align: "center" });
//         doc.setFontSize(25);
//         doc.text(candidateName, 150, 105, { align: "center" });
//         doc.setFontSize(5);
//         doc.text(
//           `______________________________________________________________________________________________________`,
//           100,
//           110
//         );
//         doc.setFontSize(14);
//         doc.text(`Has successfully completed the course in`, 150, 120, {
//           align: "center",
//         });
//         doc.setFontSize(18);
//         doc.text(course, 150, 130, { align: "center" });
//         doc.setFontSize(13);
//         doc.text(`Issued on this day:`, 150, 150, {
//           align: "center",
//         });
//         doc.setFontSize(10);
//         doc.text(`${dateIssued}`, 150, 155, {
//           align: "center",
//         });
//         doc.setFontSize(12);
//         doc.text(`Certificate ID: ${certificateId}`, 230, 190);
//         doc.text(`Signed by: _____________________`, 20, 190);
//         doc.save("certificate.pdf");

//         if (doc.save("certificate")) {
//         }
//       };
//     };
//   return (

//   <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
//       <h2 className="text-2xl font-bold text-center">Manage Certificate</h2>
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
//           <div className="flex justify-center gap-4 mt-4">
//             <button
//               onClick={() => setView("upload")}
//               className={view === "upload" ? "font-bold" : ""}
//             >
//               Upload Certificate
//             </button>
//             <button
//               onClick={() => setView("generate")}
//               className={view === "generate" ? "font-bold" : ""}
//             >
//               Generate Certificate
//             </button>
//           </div>

//           {view === "upload" ? (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 generatePDF();
//               }}
//               className="mt-4"
//             >
//               <input
//                 type="text"
//                 placeholder="Candidate Name"
//                 required
//                 onChange={(e) => setCandidateName(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Certificate ID"
//                 required
//                 onChange={(e) => setCertificateId(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Organization"
//                 required
//                 onChange={(e) => setOrganization(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-2 rounded"
//               >
//                 {loading ? "Uploading..." : "Upload Certificate"}
//               </button>
//             </form>
//           ) : (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 generatePDF();
//               }}
//               className="mt-4"
//             >
//               <input
//                 type="text"
//                 placeholder="Candidate Name"
//                 required
//                 onChange={(e) => setCandidateName(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Certificate ID"
//                 required
//                 onChange={(e) => setCertificateId(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Organization"
//                 required
//                 onChange={(e) => setOrganization(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Course of Study"
//                 required
//                 onChange={(e) => setCourse(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />
//               <input
//                 type="text"
//                 placeholder="Date Issued"
//                 required
//                 onChange={(e) => setDateIssued(e.target.value)}
//                 className="w-full p-2 border rounded mb-4"
//               />

//               <div className="mb-4">
//                 <label className="block text-gray-600">
//                   Upload School Logo - jpeg or png
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/png, image/jpeg"
//                   onChange={handleLogoUpload}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-2 rounded"
//               >
//                 {loading ? "Generating..." : "Generate & Upload Certificate"}
//               </button>
//             </form>
//           )}
//           {ipfsHash && (
//             <div className="mt-4 p-4 bg-gray-100 rounded text-center">
//               <p className="text-green-600 font-bold">Upload Successful!</p>
//               <a
//                 href={`https://ipfs.io/ipfs/${ipfsHash}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 View Certificate
//               </a>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default CertificateManager;

// ================================================================================
"use client";

import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "../../../../contract";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useGlobalContext } from "@/app/context";
import { jsPDF } from "jspdf";

const CertificateManager = () => {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [organization, setOrganization] = useState("");
  const [institute, setInstitute] = useState("");
  const [course, setCourse] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [view, setView] = useState("upload");
  const { walletAddress, connectWallet, setWalletAddress } = useGlobalContext();

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) setWalletAddress(storedWallet);
  }, [setWalletAddress]);

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
        { headers: { Authorization: `Bearer ${pinataJWT}` } }
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
      throw new Error(
        "Failed to store certificate on blockchain - Ensure certificate Id is not already stored in database"
      );
    }
  };

  const saveToDatabase = async (
    certificateId: string,
    ipfsHash: string,
    candidateName: string,
    issuedBy: string,
    organization: string
  ) => {
    try {
      await axios.post("/api/certificateToDatabase", {
        certificateId,
        ipfsHash,
        candidateName,
        issuedBy: walletAddress,
        organization,
        status: "ISSUED",
      });
    } catch (err) {
      console.error("Database Insertion Error:", err);
      throw new Error("Failed to save to database");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFile(null);
    setCandidateName("");
    setCertificateId("");
    setIpfsHash("");
    setIssuedBy("");
    setOrganization("");

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ✅ Clears file input field
    }
  };

  const handleSubmitUploadedCertificate = async (e: React.FormEvent) => {
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
        walletAddress,
        organization
      );

      alert("Certificate Uploaded on Blockchain and Database Successfully!");

      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generatePDF = async () => {
    if (!candidateName || !certificateId || !organization) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(3);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    if (logo) {
      doc.addImage(logo, "PNG", (pageWidth - 35) / 2, 7, 35, 35);
    }

    doc.setFontSize(30);
    doc.text(organization, 150, 55, { align: "center" });
    doc.setFontSize(20);
    doc.text("Certificate of Completion", 150, 75, { align: "center" });
    doc.setFontSize(15);
    doc.text("This is to certify that", 150, 90, { align: "center" });
    doc.setFontSize(25);
    doc.text(candidateName, 150, 105, { align: "center" });
    doc.setFontSize(14);
    doc.text("Has successfully completed the course in", 150, 120, {
      align: "center",
    });
    doc.setFontSize(18);
    doc.text(course, 150, 130, { align: "center" });
    doc.setFontSize(13);
    doc.text("Issued on this day:", 150, 150, { align: "center" });
    doc.setFontSize(10);
    doc.text(dateIssued, 150, 155, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Certificate ID: ${certificateId}`, 230, 190);
    doc.text("Signed by: _____________________", 20, 190);
    doc.save("certificate.pdf");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center">Manage Certificate</h2>
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
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setView("upload")}
              className={view === "upload" ? "font-bold" : ""}
            >
              Upload Certificate
            </button>
            <button
              onClick={() => setView("generate")}
              className={view === "generate" ? "font-bold" : ""}
            >
              Generate Certificate
            </button>
          </div>

          {view === "upload" ? (
            <form onSubmit={handleSubmitUploadedCertificate} className="mt-4">
              <input
                type="text"
                placeholder="Candidate Name"
                required
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Certificate ID"
                required
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Organization/Institute"
                required
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full p-2 border rounded mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                {loading ? "Uploading..." : "Upload Certificate"}
              </button>
            </form>
          ) : (
            <form className="mt-4">
              <input
                type="text"
                placeholder="Candidate Name"
                required
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Certificate ID"
                required
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Organization"
                required
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Course of Study"
                required
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Date Issued"
                required
                onChange={(e) => setDateIssued(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />

              <div className="mb-4">
                <label className="block text-gray-600">
                  Upload School Logo - jpeg or png
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleLogoUpload}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                onClick={generatePDF}
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                {loading ? "Generating..." : "Generate Certificate"}
              </button>
            </form>
          )}
          {ipfsHash && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-center">
              <p className="text-green-600 font-bold">Upload Successful!</p>
              <a
                href={`https://ipfs.io/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Certificate
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CertificateManager;
