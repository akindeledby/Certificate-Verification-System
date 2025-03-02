"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext } from "@/app/context";
import { ethers } from "ethers";

const GuestDashboard = () => {
  const { userId } = useParams(); // ✅ Extract userId from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { walletAddress, setWalletAddress } = useGlobalContext();

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
    }
  }, [setWalletAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        localStorage.setItem("walletAddress", address);
        setWalletAddress(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetch(`/api/getUserData?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user data:", error))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (!userId)
    return <p className="text-center text-red-500">User ID not found!</p>;
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to the Guest Dashboard</h1>
      <p className="mt-2 text-gray-600">Your User ID: {userId}</p>

      {userData ? (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h2 className="text-lg font-semibold">User Details</h2>
          <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-red-500">No user data found.</p>
      )}

      <div className="text-blue-600 mt-5 flex justify-center text-lg">
        {walletAddress ? (
          <p>Connected Wallet Address: {walletAddress}</p>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
