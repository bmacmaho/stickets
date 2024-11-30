"use client";

import { FC, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import NavBar from "@/components/NavBar";
import {
  useAccount,
  useBalance,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import jsonData from "../../abi.json";
import { Abi } from "starknet";

const CONTRACT_ADDRESS =
  "0x050c8bd1fbbfb52c76a5df9bcd748bcc6dfef7239234c2819e23195760cbfbf7";
const ABI: Abi = jsonData;

const concert = {
  id: 1,
  name: "Starknet Hackaton",
  description:
    "A weekend with a bunch of nerds gathered together to hack instead of spending quality time with their families, overdosing on caffeine, and overeating just to make it all worthwhile. Expect sleep deprivation, code collisions, and the kind of teamwork that only exists when there's a deadline and a 10-minute snack break. It's chaos, it's code, it's a whole vibe—don’t miss it!",
  tickets: 42,
  available: 50,
  price: "free",
  date: new Date(2022, 10, 29),
  genre: "Nerd",
  venue: "42Berlin",
  lineup: ["Lana", "Michael", "Timothée", "Chqrles", "Robert"],
};

interface EventOverviewProps {
  setBuyTicketsIsOpen: any;
}

const EventOverview: FC<EventOverviewProps> = ({ setBuyTicketsIsOpen }) => {
  const [quantity, setQuantity] = useState(1);
  const { address, status } = useAccount();
  const { contract } = useContract({ abi: ABI, address: CONTRACT_ADDRESS });
  const { data } = useBalance({ address });

  const { send, error, isLoading, isSuccess } = useSendTransaction({
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <NavBar />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white hover:bg-gray-100 transition-all"
              onClick={() => setBuyTicketsIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <img
            src="https://ipfs.io/ipfs/QmfFLkQEqbYNSqn7wQN9Kd2XJuJJe4ZHEhaG6jADQDRjfr/starknet42berlin.png"
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
          <CardHeader>
            <CardTitle className="text-3xl">{concert.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{concert.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Date:</p>
                <p>{format(concert.date, "MMMM d, yyyy")}</p>
              </div>
              <div>
                <p className="font-semibold">Venue:</p>
                <p>{concert.venue}</p>
              </div>
              <div>
                <p className="font-semibold">Genre:</p>
                <p>{concert.genre}</p>
              </div>
              <div>
                <p className="font-semibold">Available Tickets:</p>
                <p>{concert.available}</p>
              </div>
              <div>
                <p className="font-semibold">Price per Ticket:</p>
                <p>{concert.price}</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Lineup:</h3>
              <ul className="list-disc list-inside">
                {concert.lineup.map((artist, index) => (
                  <li key={index}>{artist}</li>
                ))}
              </ul>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Buy Tickets</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Purchase Tickets for {concert.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={concert.available}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="mt-1"
                  />
                  <p className="mt-2">
                    Current Balance {readableBalance(data)}
                  </p>
                  <p className="mt-2">
                    Total Price: {(quantity * concert.price).toFixed(2)} ETH
                  </p>
                  <Button onClick={handleMint} disabled={isLoading || !address}>
                    {isLoading ? "Minting..." : "Mint NFT"}
                  </Button>
                  {isSuccess && (
                    <div className="mt-4">
                      <p className="text-green-500">
                        Tickets purchased successfully!
                      </p>
                    </div>
                  )}
                  {error && (
                    <p className="text-red-500 mt-4">{error.message}</p>
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
