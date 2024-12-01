import { FC } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Wallet, Music } from "lucide-react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import ConnectModal from "../../../src/components/starknet/ConnectModal.tsx";
import Link from 'next/link';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: FC<LoginProps> = ({ setIsLoggedIn }) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const onSuccess = (response: any) => {
    console.log(response);
    setIsLoggedIn(true);
  };

  const verifyProof = async (proof: any) => {
    console.log("Proof received: ", proof);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-pink-500 to-red-400">
      <nav className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Music color='white' />
                <span className="ml-2 text-xl font-bold text-white">Stickets</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" className="border-indigo-500 text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/concerts" className="border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Concerts
                </Link>
                <Link href="/venues" className="border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Venues
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {address ? (
                <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-white/95 transition-all duration-200 shadow-sm">
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
                <div className="hidden sm:flex sm:items-center">
                  <ConnectModal />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
          <CardHeader className="text-center p-6 border-b border-gray-200">
            <CardTitle className="text-3xl font-bold text-purple-600">
              STickets
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Access exclusive events with ease.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
              <>
                <div className="flex justify-center">
                  <IDKitWidget
                    app_id="app_8755fcecdca34404a7c6afff893040c1"
                    action="verify-humans"
                    signal="user_value"
                    onSuccess={onSuccess}
                    verification_level={VerificationLevel.Orb}
                    handleVerify={verifyProof}
                  >
                    {({ open }) => (
                      <Button
                        onClick={open}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md transition duration-200"
                        size="lg"
                      >
                        <Globe className="h-5 w-5" />
                        <span>Verify with WorldID</span>
                      </Button>
                    )}
                  </IDKitWidget>
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="absolute bg-white px-3 text-sm text-gray-500">
                    OR
                  </span>
                  <hr className="w-full border-gray-300" />
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsLoggedIn(true)}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
                    size="lg"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    <span>Continue as Guest</span>
                  </Button>
                </div>
              </>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
