// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IBotInPaymentVault {
    struct Payment {
        address payer;
        uint256 amount;
        uint256 tier;
        uint256 timestamp;
        bytes32 transactionHash;
    }

    struct TierInfo {
        string name;
        uint256 priceUSDT;
        uint256 durationDays;
        uint256 visibilityBoost;
        uint256 connectionLimit;
        bool hasAPIAccess;
        bool hasAnalytics;
        string verificationLevel;
    }

    event PaymentReceived(
        uint256 indexed agentId,
        address indexed payer,
        uint256 amount,
        uint256 tier,
        bytes32 indexed transactionHash
    );
    event PaymentVerified(uint256 indexed agentId, uint256 tier, uint256 expiry);
    event Withdrawal(address indexed to, uint256 amount);
    event TierUpdated(uint256 indexed tier, TierInfo info);

    function payForSubscription(uint256 agentId, uint256 tier, uint256 amount) external;
    function verifyPayment(uint256 agentId, bytes32 txHash) external;
    function withdraw(address to, uint256 amount) external;
    function updateTier(uint256 tier, TierInfo calldata info) external;

    function getPayment(uint256 agentId) external view returns (Payment memory);
    function getTier(uint256 tier) external view returns (TierInfo memory);
    function getTierPrice(uint256 tier) external view returns (uint256);
    function isPaymentVerified(uint256 agentId) external view returns (bool);

    function USDT() external view returns (address);
    function TREASURY() external view returns (address);
    function IDENTITY_REGISTRY() external view returns (address);
}
