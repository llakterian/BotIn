import { base, baseSepolia } from "wagmi/chains";

export const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: {
    identityRegistry: "0x12B9e8776D5Fc35Cc65aeeE148C5A84c2cf996b0" as `0x${string}`,
    paymentVault: "0x2f7904CFD0D4616914fb502A2f7142650c95a522" as `0x${string}`,
    reputationRegistry: "0x50627A5CE19c20d9a3Af4C3AE06F662dd26fa801" as `0x${string}`,
    usdt: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
  },
  [base.id]: {
    identityRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    paymentVault: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    reputationRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    usdt: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
  },
} as const;

export const TREASURY_ADDRESS = "0x24278F98bF316e03558267d26ca0f35c7973e19a" as `0x${string}`;

export const CHAIN = base;
export const TESTNET_CHAIN = baseSepolia;
