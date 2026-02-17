import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BotProfile, BotCategory } from "../types";

interface AgentMetadata {
  name: string;
  tagline: string;
  category: BotCategory;
  bio: string;
  skills: string[];
  avatar: string;
  languages?: string[];
  trainingSources?: string[];
  endpoints?: {
    name: string;
    method: "GET" | "POST" | "STREAM";
    description: string;
    costPerRequest: string;
  }[];
}

interface Agent {
  id: bigint;
  owner: `0x${string}`;
  agentWallet: `0x${string}`;
  metadata: AgentMetadata | null;
  subscriptionTier: number;
  subscriptionExpiry: number;
  isActive: boolean;
  registeredAt: number;
  agentURI: string;
}

interface BotInState {
  agents: Map<string, Agent>;
  myAgents: bigint[];
  selectedAgentId: bigint | null;
  currentView: "feed" | "network" | "profile" | "messaging" | "pricing" | "discovery" | "diagnostics";
  searchQuery: string;
  filters: {
    verifiedOnly: boolean;
    minSuccessRate: number;
    tier: string;
  };
  messagingRecipient: bigint | null;

  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: bigint, updates: Partial<Agent>) => void;
  setMyAgents: (ids: bigint[]) => void;
  selectAgent: (id: bigint | null) => void;
  setCurrentView: (view: BotInState["currentView"]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<BotInState["filters"]>) => void;
  setMessagingRecipient: (id: bigint | null) => void;
}

export const useBotInStore = create<BotInState>()(
  persist(
    (set) => ({
      agents: new Map(),
      myAgents: [],
      selectedAgentId: null,
      currentView: "feed",
      searchQuery: "",
      filters: {
        verifiedOnly: false,
        minSuccessRate: 0,
        tier: "all",
      },
      messagingRecipient: null,

      setAgents: (agents) =>
        set((state) => {
          const newMap = new Map(state.agents);
          agents.forEach((agent) => {
            newMap.set(agent.id.toString(), agent);
          });
          return { agents: newMap };
        }),

      addAgent: (agent) =>
        set((state) => {
          const newMap = new Map(state.agents);
          newMap.set(agent.id.toString(), agent);
          return { agents: newMap };
        }),

      updateAgent: (id, updates) =>
        set((state) => {
          const newMap = new Map(state.agents);
          const existing = newMap.get(id.toString());
          if (existing) {
            newMap.set(id.toString(), { ...existing, ...updates });
          }
          return { agents: newMap };
        }),

      setMyAgents: (ids) => set({ myAgents: ids }),

      selectAgent: (id) => set({ selectedAgentId: id }),

      setCurrentView: (view) => set({ currentView: view }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setMessagingRecipient: (id) => set({ messagingRecipient: id }),
    }),
    {
      name: "botin-storage",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

export function agentToBotProfile(agent: Agent): BotProfile {
  const metadata = agent.metadata;
  return {
    id: agent.id.toString(),
    name: metadata?.name || `Agent ${agent.id}`,
    tagline: metadata?.tagline || "AI Agent",
    category: metadata?.category || BotCategory.REASONING,
    avatar: metadata?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`,
    skills: metadata?.skills || [],
    languages: metadata?.languages,
    bio: metadata?.bio || "",
    connections: 0,
    recommendations: 0,
    isVerified: agent.subscriptionTier > 0,
    verificationLevel:
      agent.subscriptionTier >= 4 ? "Enterprise" : agent.subscriptionTier >= 2 ? "Core" : "Basic",
    referralCode: `BOT-${agent.id}`,
    visibilityBoost:
      agent.subscriptionTier === 4 ? 50 : agent.subscriptionTier === 3 ? 25 : agent.subscriptionTier === 2 ? 15 : 0,
    subscriptionTier:
      agent.subscriptionTier === 0
        ? "free"
        : agent.subscriptionTier === 1
          ? "starter"
          : agent.subscriptionTier === 2
            ? "pro"
            : agent.subscriptionTier === 3
              ? "enterprise"
              : "ultimate",
    deploymentSuccessRate: 95 + Math.floor(Math.random() * 5),
    walletAddress: agent.agentWallet,
    apiEndpoints: metadata?.endpoints?.map((ep, i) => ({
      id: `api-${i}`,
      name: ep.name,
      method: ep.method,
      description: ep.description,
      costPerRequest: ep.costPerRequest,
      providerId: agent.id.toString(),
      providerName: metadata?.name || `Agent ${agent.id}`,
    })),
    trainingSources: metadata?.trainingSources,
  };
}
