import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useCallback, useMemo } from "react";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { IDENTITY_REGISTRY_ABI, PAYMENT_VAULT_ABI, ERC20_ABI } from "../config/abis";

export function useChainId() {
  const { chainId } = useAccount();
  return chainId ?? 84532;
}

export function useContracts() {
  const chainId = useChainId();
  return useMemo(() => CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES[84532], [chainId]);
}

export function useAgentRegistration() {
  const { address } = useAccount();
  const contracts = useContracts();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const register = useCallback(
    (agentURI: string) => {
      if (!address) return;
      writeContract({
        address: contracts.identityRegistry,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: "registerWithURI",
        args: [agentURI],
      });
    },
    [address, contracts.identityRegistry, writeContract]
  );

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  return { register, hash, isPending, isConfirming, isSuccess, error };
}

export function useAgentInfo(agentId: bigint) {
  const contracts = useContracts();
  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.identityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "getAgentInfo",
    args: [agentId],
    query: {
      enabled: agentId > 0n,
    },
  });

  return { data, isLoading, error, refetch };
}

export function useAgentCount() {
  const contracts = useContracts();
  const { data, isLoading, refetch } = useReadContract({
    address: contracts.identityRegistry,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "getAgentCount",
  });

  return { count: data, isLoading, refetch };
}

export function usePayment() {
  const { address } = useAccount();
  const contracts = useContracts();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const approveUSDT = useCallback(
    (amount: bigint) => {
      if (!address) return;
      writeContract({
        address: contracts.usdt,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contracts.paymentVault, amount],
      });
    },
    [address, contracts, writeContract]
  );

  const payForSubscription = useCallback(
    (agentId: bigint, tier: bigint, amount: bigint) => {
      if (!address) return;
      writeContract({
        address: contracts.paymentVault,
        abi: PAYMENT_VAULT_ABI,
        functionName: "payForSubscription",
        args: [agentId, tier, amount],
      });
    },
    [address, contracts.paymentVault, writeContract]
  );

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  return { approveUSDT, payForSubscription, hash, isPending, isConfirming, isSuccess, error };
}

export function useTier(tierId: bigint) {
  const contracts = useContracts();
  const { data, isLoading } = useReadContract({
    address: contracts.paymentVault,
    abi: PAYMENT_VAULT_ABI,
    functionName: "getTier",
    args: [tierId],
  });

  return { tier: data, isLoading };
}

export function useUSDTBalance() {
  const { address } = useAccount();
  const contracts = useContracts();
  const { data, isLoading, refetch } = useReadContract({
    address: contracts.usdt,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  return { balance: data, isLoading, refetch };
}