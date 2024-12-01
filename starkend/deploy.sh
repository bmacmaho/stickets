#!/usr/bin/bash

set -euo pipefail
set -a
source "$(pwd)/.env"
set +a

validate_env_var() {
    local var_name="$1"
    local var_value="${!var_name}"
    if [ -z "$var_value" ]; then
        echo "Error: $var_name is not defined in .env file"
        exit 1
    fi
}

validate_env_var "RPC_API_KEY"
validate_env_var "ACCOUNT_NAME"
DEFAULT_RPC="https://rpc.nethermind.io/sepolia-juno?apikey=$RPC_API_KEY"

convert_to_bytearray() {
    local input="$1"
    python3 to_bytearray.py "$input"
}

deploy_contract() {
    local contract_name="$1"
    shift
    local constructor_args=()
    local arg_count=1
    for arg in "$@"; do
        if [[ "$arg_count" -le 3 ]]; then
            constructor_args+=("$(convert_to_bytearray "$arg")")
        else
	    # NOTE: short-circuit only works for 128-bit numbers
            constructor_args+=("$arg 0") 
        fi
        ((arg_count++))
    done

    # Rest of the deployment logic...
    local formatted_args="${constructor_args[*]}"
    local formatted_args=""
    for arg in "${constructor_args[@]}"; do
        formatted_args+="\"$(printf '%s' "$arg" | sed 's/"/\\"/g')\" "
    done

    local CLASS_HASH
    CLASS_HASH=$(sncast --account "$ACCOUNT_NAME" declare \
        --contract-name "$contract_name" \
        --url "$DEFAULT_RPC" \
        --fee-token strk \
        || { echo "Failed to declare $contract_name contract."; exit 1; } \
        | awk '$1 ~ /class_hash:/ { print $2 }')

    echo "Declared $contract_name - Class hash: $CLASS_HASH"

    sncast --account "$ACCOUNT_NAME" deploy \
        --url "$DEFAULT_RPC" \
        --fee-token strk \
        --class-hash "$CLASS_HASH" \
        --constructor-calldata "$formatted_args" \
        || { echo "Failed to deploy $contract_name contract."; exit 1; }

    echo "Successfully deployed $contract_name contract"
}

main() {
    deploy_contract "ft_NFT" \
        "STickets" \
        "STCK" \
        "https://ipfs.io/ipfs/QmNmfWp6LVmR8FLTk5gKz2pdaBxXmpaVEnS6CxgfMBmzGv/" \
        "42"
}

main

