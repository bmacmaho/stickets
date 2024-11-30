import Link from 'next/link'
// import { Button } from '@/components/ui/button'
import { Music } from 'lucide-react'
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
          {address ? (
            <div className="flex flex-col items-end bg-zinc-100 rounded-md px-6 py-2">
            <p className="font-semibold">{`${address.slice(
                0,
                6,
            )}...${address.slice(-4)}`}</p>
            <p
                onClick={() => disconnect()}
                className="cursor-pointer text-black/50"
            >
                Disconnect
            </p>
            </div>
        ) : (<div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ConnectModal />
            {/* <Button variant="secondary">Connect Wallet</Button> */}
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}

