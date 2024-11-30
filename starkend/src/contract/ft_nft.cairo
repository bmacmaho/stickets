
#[starknet::interface]
pub trait Ift_NFT<TContractState> {
    fn ft_mint(
        ref self: TContractState,
        recipient: starknet::ContractAddress,
    );
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
    ) {
        let name: ByteArray = "ft_NFT";
        let symbol: ByteArray = "FTFT";
        let base_uri: ByteArray = "https://ipfs.io/ipfs/QmWL7kyn7sV3JdQkiobQw6CfuRaxeZ6Hvvca6Z2Ym7CM3t/";
//        let base_uri: ByteArray = "https://ipfs.io/ipns/k51qzi5uqu5di1cpa94xzv8cg3vxj8mty6yzf5923v87bddflxfxhvj2v576gw";
        self.max_supply.write(42);
        self.minted_count.write(0_u256);
        self.erc721.initializer(name, symbol, base_uri);
    }

    #[abi(embed_v0)]
    impl ft_NFTImpl of super::Ift_NFT<ContractState> {
      fn ft_mint(ref self: ContractState, recipient: ContractAddress) {
          assert(self.minted_count.read() < self.max_supply.read(), 'SOLD OUT!');
          self.minted_count.write(self.minted_count.read() + 1_u256);
          self.erc721.mint(recipient, self.minted_count.read());
      }
    }
}

