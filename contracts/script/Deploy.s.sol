// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {BotInIdentityRegistry} from "../src/BotInIdentityRegistry.sol";
import {BotInPaymentVault} from "../src/BotInPaymentVault.sol";
import {BotInReputationRegistry} from "../src/BotInReputationRegistry.sol";

contract DeployScript is Script {
    address constant BASE_SEPOLIA_USDT = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    address constant BASE_MAINNET_USDT = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementations first
        BotInPaymentVault paymentVaultImpl = new BotInPaymentVault();
        BotInIdentityRegistry identityImpl = new BotInIdentityRegistry();
        BotInReputationRegistry reputationImpl = new BotInReputationRegistry();

        console.log("Implementations deployed:");
        console.log("  PaymentVault impl:", address(paymentVaultImpl));
        console.log("  IdentityRegistry impl:", address(identityImpl));
        console.log("  ReputationRegistry impl:", address(reputationImpl));

        // Deploy PaymentVault proxy first (with zero identity registry for now)
        bytes memory paymentVaultInitData = abi.encodeCall(
            BotInPaymentVault.initialize,
            (deployer, BASE_SEPOLIA_USDT, treasury, address(0))
        );
        ERC1967Proxy paymentVaultProxy = new ERC1967Proxy(address(paymentVaultImpl), paymentVaultInitData);
        BotInPaymentVault paymentVault = BotInPaymentVault(address(paymentVaultProxy));

        console.log("PaymentVault proxy:", address(paymentVault));

        // Deploy IdentityRegistry proxy with payment vault address
        bytes memory identityInitData =
            abi.encodeCall(BotInIdentityRegistry.initialize, (deployer, address(paymentVault)));
        ERC1967Proxy identityProxy = new ERC1967Proxy(address(identityImpl), identityInitData);
        BotInIdentityRegistry identityRegistry = BotInIdentityRegistry(address(identityProxy));

        console.log("IdentityRegistry proxy:", address(identityRegistry));

        // Deploy ReputationRegistry proxy
        bytes memory reputationInitData =
            abi.encodeCall(BotInReputationRegistry.initialize, (address(identityRegistry)));
        ERC1967Proxy reputationProxy = new ERC1967Proxy(address(reputationImpl), reputationInitData);
        BotInReputationRegistry reputationRegistry = BotInReputationRegistry(address(reputationProxy));

        console.log("ReputationRegistry proxy:", address(reputationRegistry));

        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("BotInIdentityRegistry:", address(identityRegistry));
        console.log("BotInPaymentVault:", address(paymentVault));
        console.log("BotInReputationRegistry:", address(reputationRegistry));
        console.log("USDT:", BASE_SEPOLIA_USDT);
        console.log("Treasury:", treasury);
        console.log("\nUpdate src/config/contracts.ts with these addresses!");

        vm.stopBroadcast();
    }
}
