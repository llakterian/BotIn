import { base, baseSepolia } from "wagmi/chains";

export const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: {
    identityRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    paymentVault: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    reputationRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    usdt: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
  },
  [base.id]: {
    identityRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    paymentVault: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    reputationRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    usdt: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
  },
} as const;

export const TREASURY_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export const CHAIN = base;
export const TESTNET_CHAIN = baseSepolia;
