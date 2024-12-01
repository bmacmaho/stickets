import Link from 'next/link'
import { Music, Wallet } from 'lucide-react'
import { useAccount, useDisconnect } from '@starknet-react/core';
import ConnectModal from './starknet/ConnectModal';

export default function NavBar() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();

  return (
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
  )
}
