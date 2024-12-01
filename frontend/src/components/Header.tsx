import { useAccount, useDisconnect } from "@starknet-react/core";
import React from "react";
import ConnectModal from "./starknet/ConnectModal";
import { Wallet } from "lucide-react";

export default function Header() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm flex justify-end px-4 py-3">
      {address ? (
        <div className="bg-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100">
          <Wallet className="h-5 w-5 text-purple-600" />
          <div className="flex flex-col">
            <p className="font-medium text-purple-600">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </p>
            <button
              onClick={() => disconnect()}
              className="text-xs text-pink-500 hover:text-pink-600 text-left transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <ConnectModal />
      )}
    </div>
  );
}
