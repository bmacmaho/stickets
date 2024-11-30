import { FC, useState } from "react";
import {
  useSendTransaction,
  useContract,
  useNetwork,
  useAccount,
  useInjectedConnectors,
  useBalance,
} from "@starknet-react/core";
import type { Abi } from "starknet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Replace this ABI with your actual contract's ABI
const abi = [
  {
    type: "function",
    name: "transfer",
    state_mutability: "external",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [],
  },
] as const satisfies Abi;

// Replace this with deployed contract address
const CONTRACT_ADDRESS = "0x123...";

const isValidAddress = (addr: string): boolean => /^(0x)?[0-9a-f]{64}$/i.test(addr);

const StarknetPayment: FC = () => {
	const { address } = useAccount();
	const { available, connect, disconnect } = useInjectedConnectors();
	const { data: balance, error: balanceError, isLoading: isBalanceLoading } = useBalance({
	  address,
	});

	const [recipient, setRecipient] = useState<string | null>(null);
	const [amount, setAmount] = useState<string | null>(null);

  const { contract } = useContract({
    abi,
    address: CONTRACT_ADDRESS,    // // use actual contract address here
  });

  const { send, error, isLoading, isSuccess, data } = useSendTransaction({
    calls: contract && recipient && amount
      ? [contract.populate("transfer", [recipient, BigInt(amount)])]
      : undefined,
  });

  const handleConnect = async (connectorId: string) => {
    const connector = available.find((c) => c.id === connectorId);
    if (connector) {
      await connect(connector);
    }
  };

  const handleSend = () => {
    if (!contract || !address) {
      alert("Wallet not connected or contract unavailable.");
      return;
    }
    if (!recipient || !isValidAddress(recipient)) {
      alert("Invalid recipient address.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || BigInt(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (balance && BigInt(balance.formatted) < BigInt(amount)) {
      alert("Insufficient balance to complete the transaction.");
      return;
    }
    send();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Starknet Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {!address ? (
          <div className="space-y-2">
            <p>Connect your wallet to make a payment:</p>
            {available.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                className="w-full"
              >
                Connect {connector.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p>Connected: {address}</p>
            <Button onClick={disconnect} variant="outline" className="w-full">
              Disconnect
            </Button>
            {/* Wallet Balance Display */}
            <div>
              {isBalanceLoading ? (
                <p>Loading wallet balance...</p>
              ) : balanceError ? (
                <p className="text-red-500">Error fetching balance.</p>
              ) : (
                <p>Wallet Balance: {balance ? `${balance.formatted} ETH` : "0 ETH"}</p>
              )}
            </div>
            <Input
              placeholder="Recipient address"
              value={recipient || ""}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !recipient || !amount}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Payment"}
            </Button>
            {isSuccess && data && (
              <p className="text-green-500">
                Transaction sent successfully! <br />
                <a
                  href={`https://starkscan.io/tx/${data.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on StarkScan
                </a>
              </p>
            )}
            {error && (
              <p className="text-red-500">
                Transaction failed: {error.message || "Unknown error"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StarknetPayment