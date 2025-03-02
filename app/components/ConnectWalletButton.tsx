"use client";

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "../context";

const ConnectWalletButton: React.FC = () => {
  const { walletAddress, connectWallet } = useGlobalContext();

  return (
    <Button
      size="sm"
      variant="sky"
      className="text-white"
      onClick={connectWallet}
    >
      {walletAddress ? "Wallet Connected" : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWalletButton;
