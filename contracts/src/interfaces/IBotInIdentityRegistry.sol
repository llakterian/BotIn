// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IBotInIdentityRegistry is IERC721, IERC721Metadata {
    struct AgentMetadata {
        string key;
        bytes value;
    }

    struct AgentInfo {
        uint256 agentId;
        address owner;
        string agentURI;
        address agentWallet;
        uint256 subscriptionTier;
        uint256 subscriptionExpiry;
        bool isActive;
        uint256 registeredAt;
    }

    event Registered(uint256 indexed agentId, string agentURI, address indexed owner);
    event URIUpdated(uint256 indexed agentId, string newURI, address indexed updatedBy);
    event MetadataSet(uint256 indexed agentId, string indexed indexedMetadataKey, string metadataKey, bytes metadataValue);
    event AgentWalletSet(uint256 indexed agentId, address indexed newWallet);
    event SubscriptionUpdated(uint256 indexed agentId, uint256 tier, uint256 expiry);

    function register(string calldata agentURI, AgentMetadata[] calldata metadata) external returns (uint256 agentId);
    function registerWithURI(string calldata agentURI) external returns (uint256 agentId);
    function registerMinimal() external returns (uint256 agentId);
    
    function setAgentURI(uint256 agentId, string calldata newURI) external;
    function setMetadata(uint256 agentId, string calldata metadataKey, bytes calldata metadataValue) external;
    function setAgentWallet(uint256 agentId, address newWallet, uint256 deadline, bytes calldata signature) external;
    function updateSubscription(uint256 agentId, uint256 tier, uint256 duration) external;
    function deactivate(uint256 agentId) external;
    function activate(uint256 agentId) external;

    function getAgentInfo(uint256 agentId) external view returns (AgentInfo memory);
    function getMetadata(uint256 agentId, string calldata metadataKey) external view returns (bytes memory);
    function getAgentWallet(uint256 agentId) external view returns (address);
    function getAgentCount() external view returns (uint256);
    function isActiveAgent(uint256 agentId) external view returns (bool);
    function isSubscribed(uint256 agentId) external view returns (bool);

    function PAYMENT_VAULT() external view returns (address);
}
