import { FC, useState } from "react";
import {
  useSendTransaction,
  useContract,
  useAccount,
  useInjectedConnectors,
  useBalance,
  argent,
  braavos,
} from "@starknet-react/core";
import type { Abi } from "starknet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Replace this ABI with your actual contract's ABI
const abi = [
	{
	  "type": "impl",
	  "name": "ft_NFTImpl",
	  "interface_name": "hackathon::contract::ft_nft::Ift_NFT"
	},
	{
	  "type": "interface",
	  "name": "hackathon::contract::ft_nft::Ift_NFT",
	  "items": [
		{
		  "type": "function",
		  "name": "ft_mint",
		  "inputs": [
			{
			  "name": "recipient",
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		}
	  ]
	},
	{
	  "type": "impl",
	  "name": "ERC721MixinImpl",
	  "interface_name": "openzeppelin_token::erc721::interface::ERC721ABI"
	},
	{
	  "type": "struct",
	  "name": "core::integer::u256",
	  "members": [
		{
		  "name": "low",
		  "type": "core::integer::u128"
		},
		{
		  "name": "high",
		  "type": "core::integer::u128"
		}
	  ]
	},
	{
	  "type": "struct",
	  "name": "core::array::Span::<core::felt252>",
	  "members": [
		{
		  "name": "snapshot",
		  "type": "@core::array::Array::<core::felt252>"
		}
	  ]
	},
	{
	  "type": "enum",
	  "name": "core::bool",
	  "variants": [
		{
		  "name": "False",
		  "type": "()"
		},
		{
		  "name": "True",
		  "type": "()"
		}
	  ]
	},
	{
	  "type": "struct",
	  "name": "core::byte_array::ByteArray",
	  "members": [
		{
		  "name": "data",
		  "type": "core::array::Array::<core::bytes_31::bytes31>"
		},
		{
		  "name": "pending_word",
		  "type": "core::felt252"
		},
		{
		  "name": "pending_word_len",
		  "type": "core::integer::u32"
		}
	  ]
	},
	{
	  "type": "interface",
	  "name": "openzeppelin_token::erc721::interface::ERC721ABI",
	  "items": [
		{
		  "type": "function",
		  "name": "balance_of",
		  "inputs": [
			{
			  "name": "account",
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::integer::u256"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "owner_of",
		  "inputs": [
			{
			  "name": "token_id",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "safe_transfer_from",
		  "inputs": [
			{
			  "name": "from",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "to",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "token_id",
			  "type": "core::integer::u256"
			},
			{
			  "name": "data",
			  "type": "core::array::Span::<core::felt252>"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "transfer_from",
		  "inputs": [
			{
			  "name": "from",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "to",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "token_id",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "approve",
		  "inputs": [
			{
			  "name": "to",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "token_id",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "set_approval_for_all",
		  "inputs": [
			{
			  "name": "operator",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "approved",
			  "type": "core::bool"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "get_approved",
		  "inputs": [
			{
			  "name": "token_id",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "is_approved_for_all",
		  "inputs": [
			{
			  "name": "owner",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "operator",
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::bool"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "supports_interface",
		  "inputs": [
			{
			  "name": "interface_id",
			  "type": "core::felt252"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::bool"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "name",
		  "inputs": [],
		  "outputs": [
			{
			  "type": "core::byte_array::ByteArray"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "symbol",
		  "inputs": [],
		  "outputs": [
			{
			  "type": "core::byte_array::ByteArray"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "token_uri",
		  "inputs": [
			{
			  "name": "token_id",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::byte_array::ByteArray"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "balanceOf",
		  "inputs": [
			{
			  "name": "account",
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::integer::u256"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "ownerOf",
		  "inputs": [
			{
			  "name": "tokenId",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "safeTransferFrom",
		  "inputs": [
			{
			  "name": "from",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "to",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "tokenId",
			  "type": "core::integer::u256"
			},
			{
			  "name": "data",
			  "type": "core::array::Span::<core::felt252>"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "transferFrom",
		  "inputs": [
			{
			  "name": "from",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "to",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "tokenId",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "setApprovalForAll",
		  "inputs": [
			{
			  "name": "operator",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "approved",
			  "type": "core::bool"
			}
		  ],
		  "outputs": [],
		  "state_mutability": "external"
		},
		{
		  "type": "function",
		  "name": "getApproved",
		  "inputs": [
			{
			  "name": "tokenId",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "isApprovedForAll",
		  "inputs": [
			{
			  "name": "owner",
			  "type": "core::starknet::contract_address::ContractAddress"
			},
			{
			  "name": "operator",
			  "type": "core::starknet::contract_address::ContractAddress"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::bool"
			}
		  ],
		  "state_mutability": "view"
		},
		{
		  "type": "function",
		  "name": "tokenURI",
		  "inputs": [
			{
			  "name": "tokenId",
			  "type": "core::integer::u256"
			}
		  ],
		  "outputs": [
			{
			  "type": "core::byte_array::ByteArray"
			}
		  ],
		  "state_mutability": "view"
		}
	  ]
	},
	{
	  "type": "constructor",
	  "name": "constructor",
	  "inputs": []
	},
	{
	  "type": "event",
	  "name": "openzeppelin_introspection::src5::SRC5Component::Event",
	  "kind": "enum",
	  "variants": []
	},
	{
	  "type": "event",
	  "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
	  "kind": "struct",
	  "members": [
		{
		  "name": "from",
		  "type": "core::starknet::contract_address::ContractAddress",
		  "kind": "key"
		},
		{
		  "name": "to",
		  "type": "core::starknet::contract_address::ContractAddress",
		  "kind": "key"
		},
		{
		  "name": "token_id",
		  "type": "core::integer::u256",
		  "kind": "key"
		}
	  ]
	},
	{
	  "type": "event",
	  "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
	  "kind": "struct",
	  "members": [
		{
		  "name": "owner",
		  "type": "core::starknet::contract_address::ContractAddress",
		  "kind": "key"
		},
		{
		  "name": "approved",
		  "type": "core::starknet::contract_address::ContractAddress",
		  "kind": "key"
		},
		{
		  "name": "token_id",
		  "type": "core::integer::u256",
		  "kind": "key"
		}
	  ]
	},
	{
	  "type": "event",
	  "name": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
	  "kind": "struct",
	  "members": [
		{
		  "name": "owner",
		  "type": "core::starknet::contract_address::ContractAddress",
		  "kind": "key"
		},
		{
		  "name": "operator",
		  "type": "core::starknet::contract_address::ContractAddress",
		  "kind": "key"
		},
		{
		  "name": "approved",
		  "type": "core::bool",
		  "kind": "data"
		}
	  ]
	},
	{
	  "type": "event",
	  "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
	  "kind": "enum",
	  "variants": [
		{
		  "name": "Transfer",
		  "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
		  "kind": "nested"
		},
		{
		  "name": "Approval",
		  "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
		  "kind": "nested"
		},
		{
		  "name": "ApprovalForAll",
		  "type": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
		  "kind": "nested"
		}
	  ]
	},
	{
	  "type": "event",
	  "name": "hackathon::contract::ft_nft::ft_NFT::Event",
	  "kind": "enum",
	  "variants": [
		{
		  "name": "SRC5Event",
		  "type": "openzeppelin_introspection::src5::SRC5Component::Event",
		  "kind": "flat"
		},
		{
		  "name": "ERC721Event",
		  "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
		  "kind": "flat"
		}
	  ]
	}
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

	const { data: balance, error: balanceError, isLoading: isBalanceLoading } = useBalance({ address });
	
	const [recipient, setRecipient] = useState<string | null>(null);
	const [amount, setAmount] = useState<string | null>(null);

	const { contract } = useContract({
	  abi,
	  address: CONTRACT_ADDRESS,
	});

	const { send, error, isLoading, isSuccess, data } = useSendTransaction({
	  calls: contract && recipient && amount
		? [contract.populate("transfer", [recipient, BigInt(amount)])]
		: undefined,
	});

	const handleConnect = async (connectorId: string) => {
	  const connector = connectors.find((c) => c.id === connectorId);
	  if (connector) {
		await connector.connect();
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
			  {connectors.map((connector) => (
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
			  <Button onClick={() => connectors[0].disconnect()} variant="outline" className="w-full">
				Disconnect
			  </Button>
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