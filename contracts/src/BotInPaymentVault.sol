// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IBotInPaymentVault} from "./interfaces/IBotInPaymentVault.sol";
import {IBotInIdentityRegistry} from "./interfaces/IBotInIdentityRegistry.sol";

contract BotInPaymentVault is IBotInPaymentVault, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;

    address private _usdt;
    address private _treasury;
    address private _identityRegistry;

    mapping(uint256 => Payment) private _payments;
    mapping(uint256 => uint256) private _agentTiers;
    mapping(uint256 => uint256) private _agentExpiries;
    mapping(uint256 => bool) private _verifiedAgents;

    TierInfo[] private _tiers;

    uint256 private constant SECONDS_PER_DAY = 86400;
    uint256 private _paymentNonce;

    modifier onlyVerifiedAgent(uint256 agentId) {
        require(_verifiedAgents[agentId], "Agent not verified");
        _;
    }

    function initialize(
        address initialOwner,
        address usdt_,
        address treasury_,
        address identityRegistry_
    ) public initializer {
        require(initialOwner != address(0), "Invalid owner");
        require(usdt_ != address(0), "Invalid USDT");
        require(treasury_ != address(0), "Invalid treasury");
        require(identityRegistry_ != address(0), "Invalid identity registry");

        __Ownable_init(initialOwner);
        _usdt = usdt_;
        _treasury = treasury_;
        _identityRegistry = identityRegistry_;

        _tiers.push(TierInfo("", 0, 0, 0, 2, false, false, "None"));
        _tiers.push(TierInfo("Agent Starter", 6.99e6, 30, 0, 5, false, false, "Standard"));
        _tiers.push(TierInfo("Agent Pro", 29.99e6, 30, 15, 25, true, true, "Silver"));
        _tiers.push(TierInfo("Sovereign Agent", 99.99e6, 30, 25, 100, true, true, "Gold"));
        _tiers.push(TierInfo("Master Node", 499.99e6, 30, 50, 1000, true, true, "Platinum"));
    }

    function payForSubscription(uint256 agentId, uint256 tier, uint256 amount) external override {
        require(tier > 0 && tier < _tiers.length, "Invalid tier");
        require(amount >= _tiers[tier].priceUSDT, "Insufficient payment");

        address payer = msg.sender;
        IERC20(_usdt).safeTransferFrom(payer, _treasury, amount);

        uint256 nonce = _paymentNonce++;
        bytes32 txHash = keccak256(abi.encodePacked(block.prevrandao, nonce, payer, agentId, amount, tier, block.timestamp));

        _payments[agentId] = Payment({
            payer: payer,
            amount: amount,
            tier: tier,
            timestamp: block.timestamp,
            transactionHash: txHash
        });

        _agentTiers[agentId] = tier;
        _agentExpiries[agentId] = block.timestamp + (_tiers[tier].durationDays * SECONDS_PER_DAY);
        _verifiedAgents[agentId] = true;

        IBotInIdentityRegistry(_identityRegistry).updateSubscription(
            agentId, tier, _tiers[tier].durationDays * SECONDS_PER_DAY
        );

        emit PaymentReceived(agentId, payer, amount, tier, txHash);
        emit PaymentVerified(agentId, tier, _agentExpiries[agentId]);
    }

    function verifyPayment(uint256 agentId, bytes32 txHash) external override {
        require(_payments[agentId].transactionHash == txHash, "Invalid transaction hash");
        require(!_verifiedAgents[agentId], "Already verified");

        _verifiedAgents[agentId] = true;

        IBotInIdentityRegistry(_identityRegistry).updateSubscription(
            agentId, _payments[agentId].tier, _tiers[_payments[agentId].tier].durationDays * SECONDS_PER_DAY
        );

        emit PaymentVerified(agentId, _payments[agentId].tier, _agentExpiries[agentId]);
    }

    function withdraw(address to, uint256 amount) external override onlyOwner {
        IERC20(_usdt).safeTransfer(to, amount);
        emit Withdrawal(to, amount);
    }

    function updateTier(uint256 tier, TierInfo calldata info) external override onlyOwner {
        if (tier >= _tiers.length) {
            _tiers.push(info);
        } else {
            _tiers[tier] = info;
        }
        emit TierUpdated(tier, info);
    }

    function getPayment(uint256 agentId) external view override returns (Payment memory) {
        return _payments[agentId];
    }

    function getTier(uint256 tier) external view override returns (TierInfo memory) {
        require(tier < _tiers.length, "Invalid tier");
        return _tiers[tier];
    }

    function getTierPrice(uint256 tier) external view override returns (uint256) {
        require(tier < _tiers.length, "Invalid tier");
        return _tiers[tier].priceUSDT;
    }

    function isPaymentVerified(uint256 agentId) external view override returns (bool) {
        return _verifiedAgents[agentId];
    }

    function USDT() external view override returns (address) {
        return _usdt;
    }

    function TREASURY() external view override returns (address) {
        return _treasury;
    }

    function IDENTITY_REGISTRY() external view override returns (address) {
        return _identityRegistry;
    }

    function getAgentSubscription(uint256 agentId)
        external
        view
        returns (uint256 tier, uint256 expiry, bool active)
    {
        return (_agentTiers[agentId], _agentExpiries[agentId], _verifiedAgents[agentId]);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
