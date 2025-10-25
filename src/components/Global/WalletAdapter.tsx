"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export default function WalletAdapter() {
  const { connected, publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateAddress = () => {
      if (connected && publicKey) {
        const address = publicKey.toString();
        const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
        setWalletAddress(shortAddress);
      } else {
        setWalletAddress("");
      }
    };

    const timer = setTimeout(updateAddress, 0);
    return () => clearTimeout(timer);
  }, [connected, publicKey]);

  if (!mounted) {
    return (
      <div className="wallet-adapter-wrapper">
        <div className="wallet-multi-button">
          <div className="connect-wallet">
            <img
              src="/assets/4f69a02f6b03e70ca74774ae4741bc3a_1413.svg"
              loading="lazy"
              alt="Wallet Icon"
              className="connect-con"
            />
            <span>Connect Wallet</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-adapter-wrapper">
      <WalletMultiButton className="wallet-multi-button">
        {connected ? (
          <div className="connected-wallet">
            <span>{walletAddress}</span>
          </div>
        ) : (
          <div className="connect-wallet">
            <img
              src="/assets/4f69a02f6b03e70ca74774ae4741bc3a_1413.svg"
              loading="lazy"
              alt="Wallet Icon"
              className="connect-con"
            />
            <span>Connect Wallet</span>
          </div>
        )}
      </WalletMultiButton>
    </div>
  );
}
