// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721URIStorageUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IBotInIdentityRegistry} from "./interfaces/IBotInIdentityRegistry.sol";
import {IBotInPaymentVault} from "./interfaces/IBotInPaymentVault.sol";

contract BotInIdentityRegistry is
    IBotInIdentityRegistry,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    EIP712Upgradeable
{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 private constant SET_WALLET_TYPEHASH =
        keccak256("SetAgentWallet(uint256 agentId,address newWallet,uint256 deadline)");

    mapping(uint256 => mapping(string => bytes)) private _metadata;
    mapping(uint256 => address) private _agentWallets;
    mapping(uint256 => uint256) private _subscriptionTiers;
    mapping(uint256 => uint256) private _subscriptionExpiries;
    mapping(uint256 => bool) private _isActive;
    mapping(uint256 => uint256) private _registeredAt;

    uint256 private _nextAgentId;
    address private _paymentVault;

    modifier onlyPaymentVault() {
        require(msg.sender == _paymentVault, "Only payment vault");
        _;
    }

    modifier onlyAgentOwner(uint256 agentId) {
        require(ownerOf(agentId) == msg.sender, "Not agent owner");
        _;
    }

    function initialize(address initialOwner, address paymentVault) public initializer {
        __ERC721_init("BotIn Agent Identity", "BOTIN");
        __ERC721URIStorage_init();
        __Ownable_init(initialOwner);
        __EIP712_init("BotIn Identity Registry", "1");
        _nextAgentId = 1;
        _paymentVault = paymentVault;
    }

    function register(string calldata agentURI, AgentMetadata[] calldata metadata)
        external
        override
        returns (uint256 agentId)
    {
        agentId = _nextAgentId++;
        _safeMint(msg.sender, agentId);

        if (bytes(agentURI).length > 0) {
            _setTokenURI(agentId, agentURI);
        }

        _agentWallets[agentId] = msg.sender;
        _isActive[agentId] = true;
        _registeredAt[agentId] = block.timestamp;

        bytes memory walletMetadata = abi.encode(msg.sender);
        _metadata[agentId]["agentWallet"] = walletMetadata;

        emit MetadataSet(agentId, "agentWallet", "agentWallet", walletMetadata);
        emit Registered(agentId, agentURI, msg.sender);

        for (uint256 i = 0; i < metadata.length; i++) {
            _metadata[agentId][metadata[i].key] = metadata[i].value;
            emit MetadataSet(agentId, metadata[i].key, metadata[i].key, metadata[i].value);
        }
    }

    function registerWithURI(string calldata agentURI) external override returns (uint256 agentId) {
        return _doRegister(agentURI);
    }

    function registerMinimal() external override returns (uint256 agentId) {
        string memory empty = "";
        return _doRegister(empty);
    }

    function _doRegister(string memory agentURI)
        internal
        returns (uint256 agentId)
    {
        AgentMetadata[] calldata emptyMetadata;
        agentId = _nextAgentId++;
        _safeMint(msg.sender, agentId);

        if (bytes(agentURI).length > 0) {
            _setTokenURI(agentId, agentURI);
        }

        _agentWallets[agentId] = msg.sender;
        _isActive[agentId] = true;
        _registeredAt[agentId] = block.timestamp;

        bytes memory walletMetadata = abi.encode(msg.sender);
        _metadata[agentId]["agentWallet"] = walletMetadata;

        emit MetadataSet(agentId, "agentWallet", "agentWallet", walletMetadata);
        emit Registered(agentId, agentURI, msg.sender);
    }

    function setAgentURI(uint256 agentId, string calldata newURI) external override onlyAgentOwner(agentId) {
        _setTokenURI(agentId, newURI);
        emit URIUpdated(agentId, newURI, msg.sender);
    }

    function setMetadata(uint256 agentId, string calldata metadataKey, bytes calldata metadataValue)
        external
        override
        onlyAgentOwner(agentId)
    {
        require(
            keccak256(bytes(metadataKey)) != keccak256("agentWallet"),
            "Cannot set agentWallet via setMetadata"
        );
        _metadata[agentId][metadataKey] = metadataValue;
        emit MetadataSet(agentId, metadataKey, metadataKey, metadataValue);
    }

    function setAgentWallet(uint256 agentId, address newWallet, uint256 deadline, bytes calldata signature)
        external
        override
    {
        require(block.timestamp <= deadline, "Signature expired");
        require(newWallet != address(0), "Invalid wallet");
        require(_ownerOf(agentId) != address(0), "Agent not found");

        bytes32 structHash = keccak256(abi.encode(SET_WALLET_TYPEHASH, agentId, newWallet, deadline));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.toEthSignedMessageHash().recover(signature);

        require(signer == newWallet, "Invalid signature");

        _agentWallets[agentId] = newWallet;
        bytes memory walletMetadata = abi.encode(newWallet);
        _metadata[agentId]["agentWallet"] = walletMetadata;

        emit AgentWalletSet(agentId, newWallet);
        emit MetadataSet(agentId, "agentWallet", "agentWallet", walletMetadata);
    }

    function updateSubscription(uint256 agentId, uint256 tier, uint256 duration)
        external
        override
        onlyPaymentVault
    {
        _subscriptionTiers[agentId] = tier;
        _subscriptionExpiries[agentId] = block.timestamp + duration;
        emit SubscriptionUpdated(agentId, tier, _subscriptionExpiries[agentId]);
    }

    function deactivate(uint256 agentId) external override onlyAgentOwner(agentId) {
        _isActive[agentId] = false;
    }

    function activate(uint256 agentId) external override onlyAgentOwner(agentId) {
        _isActive[agentId] = true;
    }

    function getAgentInfo(uint256 agentId) external view override returns (AgentInfo memory) {
        require(_ownerOf(agentId) != address(0), "Agent not found");
        return AgentInfo({
            agentId: agentId,
            owner: ownerOf(agentId),
            agentURI: tokenURI(agentId),
            agentWallet: _agentWallets[agentId],
            subscriptionTier: _subscriptionTiers[agentId],
            subscriptionExpiry: _subscriptionExpiries[agentId],
            isActive: _isActive[agentId],
            registeredAt: _registeredAt[agentId]
        });
    }

    function getMetadata(uint256 agentId, string calldata metadataKey)
        external
        view
        override
        returns (bytes memory)
    {
        return _metadata[agentId][metadataKey];
    }

    function getAgentWallet(uint256 agentId) external view override returns (address) {
        return _agentWallets[agentId];
    }

    function getAgentCount() external view override returns (uint256) {
        return _nextAgentId - 1;
    }

    function isActiveAgent(uint256 agentId) external view override returns (bool) {
        return _ownerOf(agentId) != address(0) && _isActive[agentId];
    }

    function isSubscribed(uint256 agentId) external view override returns (bool) {
        return _subscriptionExpiries[agentId] > block.timestamp;
    }

    function PAYMENT_VAULT() external view override returns (address) {
        return _paymentVault;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Upgradeable)
        returns (address)
    {
        address previousOwner = super._update(to, tokenId, auth);

        if (previousOwner != address(0) && to != address(0)) {
            delete _agentWallets[tokenId];
        }

        return previousOwner;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
