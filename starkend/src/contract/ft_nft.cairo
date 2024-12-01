#[starknet::interface]
pub trait Ift_NFT<TContractState> {
    fn ft_mint(
        ref self: TContractState,
        recipient: starknet::ContractAddress,
    ) -> u256;
    fn get_available(self: @TContractState) -> u256;
    fn transfer_nft(
        ref self: TContractState,
        to: starknet::ContractAddress, 
        token_id: u256);
    fn token_owner(self: @TContractState, token_id: u256) -> starknet::ContractAddress;
}

#[starknet::contract]
pub mod ft_NFT {
    use starknet::ContractAddress;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC20Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        max_supply: u256,
        minted_count: u256,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray,
        symbol: ByteArray,
        base_uri: ByteArray,
        max_supply: u256
    ) {
        assert(name.len() > 0, 'BAD NAME');
        assert(symbol.len() > 0, 'BAD SYMBL');
        assert(max_supply > 0, 'NO SUPPLY');
        self.max_supply.write(max_supply);
        self.minted_count.write(0_u256);
        self.erc721.initializer(name, symbol, base_uri);
    }

    #[abi(embed_v0)]
    impl ft_NFTImpl of super::Ift_NFT<ContractState> {
      fn ft_mint(ref self: ContractState, recipient: ContractAddress) -> u256 {
          assert(self.minted_count.read() < self.max_supply.read(), 'SOLD OUT!');
          let token_id = self.minted_count.read() + 1_u256;
          self.minted_count.write(token_id);
          self.erc721.mint(recipient, self.minted_count.read());
          token_id
      }

      fn get_available(self: @ContractState) -> u256 {
          let available: u256 = if self.minted_count.read() > self.max_supply.read() {
              0_u256
          } else {
              self.max_supply.read() - self.minted_count.read()
          };
          available
      }

      fn transfer_nft(ref self: ContractState, to: ContractAddress, token_id: u256) {
          let sender = starknet::get_caller_address();
          // TODO: how to verify if it is valid address
          self.erc721.transfer_from(sender, to, token_id);
      }

      fn token_owner(self: @ContractState, token_id: u256) -> ContractAddress {
          assert(token_id > 0 && token_id <= self.minted_count.read(), 'BAD TOKEN ID!');
          self.erc721.owner_of(token_id)
      }

    }
}

