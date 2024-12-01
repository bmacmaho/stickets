"use client";
import { type Connector, useConnect } from "@starknet-react/core";
import { Button } from "../ui/Button2";
import Dialog from "../ui/Dialog2";

export default function ConnectModal() {
  const { connect, connectors } = useConnect();
  return (
    <Dialog title="Connect Wallet">
      <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg max-w-md mx-auto">
        <p className="text-center text-xl text-white font-semibold mb-4">
          Choose your wallet to connect
        </p>
        {connectors.map((connector: Connector) => {
          return (
            <Button
              key={connector.id}
              onClick={async () =>
                connector.available() ? connect({ connector }) : null
              }
              disabled={!connector.available()}
              className="flex flex-row items-center justify-start gap-4 w-full px-5 py-3 rounded-md text-white transition-transform transform hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 shadow-md"
            >
              {connector.icon && typeof connector.icon === 'object' && connector.icon.light && (
                <img
                  src={connector.icon.dark}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              )}
              <p className="font-medium">Connect with {connector.name}</p>
            </Button>
          );
        })}
      </div>
    </Dialog>
  );
}
