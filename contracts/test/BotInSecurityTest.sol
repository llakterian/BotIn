// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {BotInIdentityRegistry} from "../src/BotInIdentityRegistry.sol";
import {BotInPaymentVault} from "../src/BotInPaymentVault.sol";
import {BotInReputationRegistry} from "../src/BotInReputationRegistry.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IBotInPaymentVault} from "../src/interfaces/IBotInPaymentVault.sol";
import {IBotInReputationRegistry} from "../src/interfaces/IBotInReputationRegistry.sol";
import {MockUSDT} from "./mocks/MockUSDT.sol";

contract BotInSecurityTest is Test {
    BotInIdentityRegistry identityRegistry;
    BotInPaymentVault paymentVault;
    BotInReputationRegistry reputationRegistry;
    MockUSDT usdt;

    address owner;
    address treasury;
    address user1;
    address user2;
    address attacker;

    uint256 constant STARTING_USDT = 1000000000;

    function setUp() public {
        owner = makeAddr("owner");
        treasury = makeAddr("treasury");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        attacker = makeAddr("attacker");

        usdt = new MockUSDT();

        vm.startPrank(owner);

        identityRegistry = new BotInIdentityRegistry();
        paymentVault = new BotInPaymentVault();
        reputationRegistry = new BotInReputationRegistry();

        paymentVault.initialize(owner, address(usdt), treasury, address(identityRegistry));
        identityRegistry.initialize(owner, address(paymentVault));
        reputationRegistry.initialize(address(identityRegistry));

        vm.stopPrank();

        usdt.mint(user1, STARTING_USDT);
        usdt.mint(user2, STARTING_USDT);
    }

    function testUnauthorizedSubscriptionUpdate() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");

        vm.stopPrank();

        vm.startPrank(attacker);
        vm.expectRevert("Only payment vault");
        identityRegistry.updateSubscription(agentId, 1, 30 days);
        vm.stopPrank();
    }

    function testOnlyAgentOwnerCanSetMetadata() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        vm.stopPrank();

        vm.startPrank(user2);
        vm.expectRevert("Not agent owner");
        identityRegistry.setMetadata(agentId, "testKey", "testValue");
        vm.stopPrank();
    }

    function testCannotOverwriteAgentWalletViaSetMetadata() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert("Cannot set agentWallet via setMetadata");
        identityRegistry.setMetadata(agentId, "agentWallet", abi.encode(attacker));
        vm.stopPrank();
    }

    function testWalletTransferClearsOldWallet() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        assertEq(identityRegistry.getAgentWallet(agentId), user1);

        identityRegistry.transferFrom(user1, user2, agentId);
        vm.stopPrank();

        assertEq(identityRegistry.getAgentWallet(agentId), address(0));
    }

    function testSignatureReplayProtection() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");

        uint256 newWalletKey = 0xA11CE;
        address newWallet = vm.addr(newWalletKey);
        uint256 deadline = block.timestamp + 1 hours;
        
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("SetAgentWallet(uint256 agentId,address newWallet,uint256 deadline)"),
                agentId,
                newWallet,
                deadline
            )
        );
        
        bytes32 domainHash = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("BotIn Identity Registry"),
                keccak256("1"),
                block.chainid,
                address(identityRegistry)
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainHash, structHash));
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(newWalletKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        identityRegistry.setAgentWallet(agentId, newWallet, deadline, signature);
        assertEq(identityRegistry.getAgentWallet(agentId), newWallet);
        
        vm.warp(deadline + 1);
        vm.expectRevert("Signature expired");
        identityRegistry.setAgentWallet(agentId, newWallet, deadline, signature);
        vm.stopPrank();
    }

    function testOwnerCannotGiveFeedback() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert("Owner cannot give feedback");
        reputationRegistry.giveFeedback(agentId, 100, 18, "quality", "speed", "", "", bytes32(0));
        vm.stopPrank();
    }

    function testFeedbackRevocation() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        vm.stopPrank();

        vm.startPrank(user2);
        reputationRegistry.giveFeedback(agentId, 100, 18, "quality", "speed", "", "", bytes32(0));
        
        uint64 lastIndex = reputationRegistry.getLastIndex(agentId, user2);
        
        reputationRegistry.revokeFeedback(agentId, lastIndex);
        
        vm.stopPrank();

        IBotInReputationRegistry.Feedback memory fb = reputationRegistry.readFeedback(agentId, user2, lastIndex);
        assertTrue(fb.isRevoked);
    }

    function testPaymentVerificationRequiresValidPayment() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");

        usdt.approve(address(paymentVault), type(uint256).max);
        
        vm.expectRevert("Insufficient payment");
        paymentVault.payForSubscription(agentId, 1, 100);
        
        vm.stopPrank();
    }

    function testOnlyOwnerCanUpdateTiers() public {
        vm.startPrank(user1);
        IBotInPaymentVault.TierInfo memory newTier = IBotInPaymentVault.TierInfo({
            name: "Hacked Tier",
            priceUSDT: 0.01e6,
            durationDays: 30,
            visibilityBoost: 0,
            connectionLimit: 10000,
            hasAPIAccess: true,
            hasAnalytics: true,
            verificationLevel: "HACKED"
        });
        
        vm.expectRevert();
        paymentVault.updateTier(6, newTier);
        vm.stopPrank();
    }

    function testOnlyOwnerCanWithdraw() public {
        usdt.mint(address(paymentVault), 1000000);

        vm.startPrank(user1);
        vm.expectRevert();
        paymentVault.withdraw(user1, 1000000);
        vm.stopPrank();
    }

    function testInvalidTierRejection() public {
        vm.startPrank(user1);
        usdt.approve(address(paymentVault), type(uint256).max);
        
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        
        vm.expectRevert("Invalid tier");
        paymentVault.payForSubscription(agentId, 99, 1000000000);
        
        vm.stopPrank();
    }

    function testZeroAddressWalletRejection() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");

        uint256 deadline = block.timestamp + 1 hours;
        
        vm.expectRevert("Invalid wallet");
        identityRegistry.setAgentWallet(agentId, address(0), deadline, "");
        vm.stopPrank();
    }

    function testValidationOnlyFromAuthorized() public {
        vm.startPrank(user1);
        uint256 agentId = identityRegistry.registerWithURI("ipfs://QmTest");
        vm.stopPrank();

        vm.startPrank(user2);
        vm.expectRevert("Not authorized");
        reputationRegistry.validationRequest(address(0x1234), agentId, "", bytes32(0));
        vm.stopPrank();
    }
}
