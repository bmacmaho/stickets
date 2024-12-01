"use client";

import { FC, useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReadContract } from "@starknet-react/core";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { X } from "lucide-react";
import NavBar from "@/components/NavBar";

import {
  useAccount,
  useBalance,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import jsonData from "../../abi.json";
import confetti from "canvas-confetti";
import { Abi } from "starknet";

const CONTRACT_ADDRESS =
  "0x07a956ec198ed2851021ba9be241939c055ff98b2eabddf055e5554d2701a933";
const ABI: Abi = jsonData;
function YourComponent() {
  const { data, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "get_available",
    args: [],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return <div>Available: {data?.toString()}</div>;
}

const concert = {
  id: 1,
  name: "Starknet Hackaton",
  description:
    "A weekend with a bunch of nerds gathered together to hack instead of spending quality time with their families, overdosing on caffeine, and overeating just to make it all worthwhile. Expect sleep deprivation, code collisions, and the kind of teamwork that only exists when there's a deadline and a 10-minute snack break. It's chaos, it's code, it's a whole vibe—don't miss it!",
  tickets: 42,
  //   available: 42,
  price: "Free",
  date: new Date(2022, 10, 29),
  genre: "Nerd",
  venue: "42Berlin",
  lineup: ["Lana", "Michael", "Timothée", "Chqrles", "Robert"],
};

const defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["star"],
  colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ["star"],
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ["circle"],
  });
}

interface EventOverviewProps {
  setBuyTicketsIsOpen: any;
}

const EventOverview: FC<EventOverviewProps> = ({ setBuyTicketsIsOpen }) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const { address } = useAccount();
  const { contract } = useContract({ abi: ABI, address: CONTRACT_ADDRESS });
  const { data } = useBalance({ address });

  const {
    send,
    error,
    isPending,
    isSuccess,
    data: txData,
  } = useSendTransaction({
    calls:
      address && contract
        ? [
            {
              contractAddress: CONTRACT_ADDRESS,
              entrypoint: "ft_mint",
              calldata: [address],
            },
          ]
        : undefined,
  });

  useEffect(() => {
    if (isSuccess) {
      // Set the transaction hash
      if (txData?.transaction_hash) {
        setTxHash(txData.transaction_hash);
      }

      // Shoot confetti
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    }
  }, [isSuccess, txData]);

  const readableBalance = (
    bData:
      | { value: bigint; decimals: number; symbol: string; formatted: string }
      | undefined
  ) => {
    if (!bData) return undefined;
    const { value, decimals, symbol } = bData;
    const balance = Number(value) / Math.pow(10, decimals);
    return `${balance.toFixed(6)} ${symbol}`;
  };

  const handleMint = () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!contract) {
      alert("Contract not loaded");
      return;
    }

    send();
  };

  // Function to open transaction in explorer
  const openTransactionInExplorer = () => {
    if (txHash) {
      window.open(`https://sepolia.voyager.online/tx/${txHash}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <NavBar />
      <main className="max-w-3xl mx-auto py-4 px-4">
        <Card className="overflow-hidden relative bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-white/20">
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 hover:bg-white/95 transition-all duration-200 shadow-sm"
              onClick={() => setBuyTicketsIsOpen(false)}
            >
              <X className="h-4 w-4 text-purple-600" />
            </Button>
          </div>

          <div className="relative">
            <img
              src="https://ipfs.io/ipfs/QmfFLkQEqbYNSqn7wQN9Kd2XJuJJe4ZHEhaG6jADQDRjfr/starknet42berlin.png"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <CardHeader className="relative z-10 -mt-16 pb-0">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">
              {concert.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {concert.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Date", value: format(concert.date, "MMMM d, yyyy") },
                { label: "Venue", value: concert.venue },
                { label: "Genre", value: concert.genre },
                { label: "Available", value: YourComponent() },

                { label: "Price", value: concert.price },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-purple-50 p-2 rounded-lg shadow-sm"
                >
                  <p className="font-semibold text-purple-600 text-xs mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-gray-700 text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-pink-50 rounded-lg p-3">
              <h3 className="font-semibold text-sm text-pink-600 mb-2">
                Lineup
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://x.com/tx_track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm text-center text-gray-700 hover:bg-white/95 hover:text-purple-600 transition-all duration-200 text-sm"
                >
                  Lana
                </a>
                <a
                  href="https://x.com/0xChqrles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm text-center text-gray-700 hover:bg-white/95 hover:text-purple-600 transition-all duration-200 text-sm"
                >
                  Chqrles
                </a>
                <a
                  href="https://x.com/monsieur_kus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm text-center text-gray-700 hover:bg-white/95 hover:text-purple-600 transition-all duration-200 text-sm"
                >
                  Michael
                </a>
                <a
                  href="https://x.com/tdelabro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm text-center text-gray-700 hover:bg-white/95 hover:text-purple-600 transition-all duration-200 text-sm"
                >
                  Timothée
                </a>
                <a
                  href="https://x.com/robertkp13?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm text-center text-gray-700 hover:bg-white/95 hover:text-purple-600 transition-all duration-200 text-sm"
                >
                  Robert
                </a>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg shadow-md transition duration-200 text-sm">
                  Buy Tickets
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-xl max-w-sm mx-auto">
                <DialogHeader className="flex flex-col items-center justify-center mb-2">
                  <DialogTitle className="text-xl font-bold text-purple-600 flex items-center gap-2">
                    {isSuccess && txHash ? (
                      <>🎉 Great Success! 🎉</>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                        Purchase Details
                      </>
                    )}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  {isSuccess && txHash ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-600 font-semibold text-center text-sm">
                          Transaction completed!
                        </p>
                      </div>
                      <Button
                        onClick={openTransactionInExplorer}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition duration-200 text-sm"
                      >
                        View Transaction
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-purple-50/50 rounded-lg divide-y divide-purple-100">
                        <div className="p-2">
                          <div className="text-xs text-purple-600 font-medium">
                            Balance
                          </div>
                          <div className="text-sm font-semibold">
                            {readableBalance(data)}
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="text-xs text-purple-600 font-medium">
                            Network
                          </div>
                          <div className="text-sm font-semibold">
                            Starknet Testnet
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleMint}
                        disabled={isPending || !address}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 rounded-lg shadow-md transition duration-200 text-sm"
                      >
                        {isPending ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <svg
                              className="animate-spin h-3 w-3 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Mint NFT"
                        )}
                      </Button>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 p-2 rounded-lg">
                      <p className="text-red-500 text-xs text-center font-medium">
                        {error.message}
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EventOverview;
