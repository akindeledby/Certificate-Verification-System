"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { ABI, CONTRACT_ADDRESS } from "../contract"; // Import contract details

// Define context type
interface ContextType {
  contract: ethers.Contract | null;
  walletAddress: string;
  setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
  connectWallet: () => Promise<void>; // Function to trigger wallet connection
}

// Create Global Context with initial null value
const GlobalContext = createContext<ContextType | null>(null);

interface GlobalContextProviderProps {
  children: ReactNode;
}

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  // Load wallet address from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWallet = localStorage.getItem("walletAddress");
      if (storedWallet) {
        setWalletAddress(storedWallet);
      }
    }
  }, []);

  // Store wallet address in localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
    }
  }, [walletAddress]);

  // Function to connect wallet manually
  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(connection);
      const signer = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setProvider(web3Provider);
        setContract(contractInstance);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{ contract, walletAddress, setWalletAddress, connectWallet }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to use GlobalContext safely
export const useGlobalContext = (): ContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
