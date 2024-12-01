#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use starknet::testing;
    use super::ft_NFT;

    // Helper function to deploy the contract
    fn deploy_contract(
        name: ByteArray, 
        symbol: ByteArray, 
        base_uri: ByteArray, 
        max_supply: u256
    ) -> ContractState {
        let mut state = ft_NFT::contract_state_for_testing();
        ft_NFT::constructor(ref state, name, symbol, base_uri, max_supply);
        state
    }

    #[test]
    fn test_constructor() {
        let state = deploy_contract(
            "TestNFT", 
            "TNFT", 
            "https://example.com/", 
            100
        );
        assert(state.get_available() == 100, 'Incorrect initial supply');
    }

    #[test]
    fn test_mint() {
        let mut state = deploy_contract(
            "TestNFT", 
            "TNFT", 
            "https://example.com/", 
            10
        );
        // Set up test address
        let recipient = testing::get_address(1);
        testing::set_caller_address(recipient);

        // Mint first NFT
        let token_id = state.ft_mint(recipient);
        assert(token_id == 1, 'First token should be 1');
        assert(state.get_available() == 9, 'Available supply should decrease');
    }

    #[test]
    #[should_panic(expected: ('SOLD OUT!',))]
    fn test_mint_exceeding_max_supply() {
        let mut state = deploy_contract(
            "TestNFT", 
            "TNFT", 
            "https://example.com/", 
            1
        );
        let recipient = testing::get_address(1);
        testing::set_caller_address(recipient);

        // First mint should work
        state.ft_mint(recipient);
        // Second mint should fail
        let second_recipient = testing::get_address(2);
        testing::set_caller_address(second_recipient);
        state.ft_mint(second_recipient);
    }
}
