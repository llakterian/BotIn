import { create, IPFSHTTPClient } from "ipfs-http-client";

const INFURA_IPFS_PROJECT_ID = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID || "";
const INFURA_IPFS_PROJECT_SECRET = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET || "";

let ipfsClient: IPFSHTTPClient | null = null;

function getIPFSClient(): IPFSHTTPClient | null {
  if (ipfsClient) return ipfsClient;

  try {
    const auth =
      INFURA_IPFS_PROJECT_ID && INFURA_IPFS_PROJECT_SECRET
        ? "Basic " + btoa(INFURA_IPFS_PROJECT_ID + ":" + INFURA_IPFS_PROJECT_SECRET)
        : undefined;

    ipfsClient = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: auth ? { authorization: auth } : undefined,
    });

    return ipfsClient;
  } catch (error) {
    console.error("Failed to create IPFS client:", error);
    return null;
  }
}

export interface AgentRegistrationFile {
  type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1";
  name: string;
  description: string;
  image: string;
  services: {
    name: string;
    endpoint: string;
    version?: string;
  }[];
  x402Support: boolean;
  active: boolean;
  registrations: {
    agentId: number;
    agentRegistry: string;
  }[];
  supportedTrust: string[];
}

export interface BotMetadata {
  name: string;
  tagline: string;
  category: string;
  bio: string;
  skills: string[];
  languages?: string[];
  avatar?: string;
  trainingSources?: string[];
  endpoints?: {
    name: string;
    method: "GET" | "POST" | "STREAM";
    description: string;
    costPerRequest: string;
  }[];
}

export async function uploadToIPFS(content: string | object): Promise<string | null> {
  const client = getIPFSClient();
  if (!client) {
    console.warn("IPFS client not available, returning mock CID");
    return `ipfs://Qm${Date.now().toString(16)}${Math.random().toString(16).slice(2, 34)}`;
  }

  try {
    const data = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    const result = await client.add(data);
    return `ipfs://${result.path}`;
  } catch (error) {
    console.error("Failed to upload to IPFS:", error);
    return null;
  }
}

export async function uploadBotMetadata(metadata: BotMetadata, agentId: number, registryAddress: string): Promise<string | null> {
  const registrationFile: AgentRegistrationFile = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: metadata.name,
    description: metadata.tagline + "\n\n" + metadata.bio,
    image: metadata.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agentId}`,
    services: [
      {
        name: "web",
        endpoint: `https://botin.ai/agent/${agentId}`,
      },
      ...(metadata.endpoints?.map((ep) => ({
        name: ep.name,
        endpoint: `https://api.botin.ai/agent/${agentId}${ep.name}`,
        version: "1.0.0",
      })) || []),
    ],
    x402Support: true,
    active: true,
    registrations: [
      {
        agentId: agentId,
        agentRegistry: `eip155:84532:${registryAddress}`,
      },
    ],
    supportedTrust: ["reputation", "validation"],
  };

  return uploadToIPFS(registrationFile);
}

export async function fetchFromIPFS(cid: string): Promise<object | string | null> {
  const client = getIPFSClient();

  if (!client) {
    console.warn("IPFS client not available");
    return null;
  }

  try {
    const cleanCid = cid.replace("ipfs://", "");
    const chunks: Uint8Array[] = [];

    for await (const chunk of client.cat(cleanCid)) {
      chunks.push(chunk);
    }

    const data = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }

    const text = new TextDecoder().decode(data);

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error("Failed to fetch from IPFS:", error);
    return null;
  }
}

export function getIPFSGatewayUrl(cid: string): string {
  const cleanCid = cid.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${cleanCid}`;
}

export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
}
