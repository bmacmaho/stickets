#!/usr/bin/bash

if [ -z "$RPC_API_KEY" ]; then echo "RPC_API_KEY not defined"; exit 1; fi
sncast --account money declare --contract-name ft_NFT \
	--url https://rpc.nethermind.io/sepolia-juno?apikey="$RPC_API_KEY" --fee-token strk


#TODO: Extract class hash to auto deploy after a set time offset

#sncast --account money deploy \
#	--url https://rpc.nethermind.io/sepolia-juno?apikeyc="$RPC_API_KEY" --fee-token strk \
#	--class-hash "$CLASS_HASH"

