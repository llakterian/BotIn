import { Registered, URIUpdated, MetadataSet, AgentWalletSet, SubscriptionUpdated, Transfer } from "../generated/BotInIdentityRegistry/BotInIdentityRegistry";
import { Agent, AgentMetadata } from "../generated/schema";
import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";

function getOrCreateAgent(agentId: string): Agent {
  let agent = Agent.load(agentId);
  if (!agent) {
    agent = new Agent(agentId);
    agent.agentId = BigInt.fromString(agentId);
    agent.owner = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    agent.agentWallet = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    agent.subscriptionTier = 0;
    agent.subscriptionExpiry = BigInt.fromI32(0);
    agent.isActive = true;
    agent.registeredAt = BigInt.fromI32(0);
    agent.updatedAt = BigInt.fromI32(0);
    agent.skills = [];
    agent.languages = [];
    agent.feedbackCount = 0;
    agent.averageRating = BigInt.fromI32(0).toBigDecimal();
    agent.validationCount = 0;
    agent.validationScore = BigInt.fromI32(0).toBigDecimal();
  }
  return agent;
}

export function handleRegistered(event: Registered): void {
  let agentId = event.params.agentId.toString();
  let agent = getOrCreateAgent(agentId);

  agent.agentId = event.params.agentId;
  agent.owner = event.params.owner;
  agent.agentURI = event.params.agentURI;
  agent.registeredAt = event.block.timestamp;
  agent.updatedAt = event.block.timestamp;
  agent.isActive = true;

  agent.save();
}

export function handleURIUpdated(event: URIUpdated): void {
  let agentId = event.params.agentId.toString();
  let agent = Agent.load(agentId);
  if (agent) {
    agent.agentURI = event.params.newURI;
    agent.updatedAt = event.block.timestamp;
    agent.save();
  }
}

export function handleMetadataSet(event: MetadataSet): void {
  let agentId = event.params.agentId.toString();
  let agent = getOrCreateAgent(agentId);

  let metadataId = agentId + "-" + event.params.metadataKey;
  let metadata = new AgentMetadata(metadataId);
  metadata.agent = agentId;
  metadata.key = event.params.metadataKey;
  metadata.value = event.params.metadataValue;
  metadata.setAt = event.block.timestamp;
  metadata.save();

  agent.updatedAt = event.block.timestamp;
  agent.save();
}

export function handleAgentWalletSet(event: AgentWalletSet): void {
  let agentId = event.params.agentId.toString();
  let agent = Agent.load(agentId);
  if (agent) {
    agent.agentWallet = event.params.newWallet;
    agent.updatedAt = event.block.timestamp;
    agent.save();
  }
}

export function handleSubscriptionUpdated(event: SubscriptionUpdated): void {
  let agentId = event.params.agentId.toString();
  let agent = Agent.load(agentId);
  if (agent) {
    agent.subscriptionTier = event.params.tier.toI32();
    agent.subscriptionExpiry = event.params.expiry;
    agent.updatedAt = event.block.timestamp;
    agent.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let agentId = event.params.tokenId.toString();
  let agent = Agent.load(agentId);
  if (agent) {
    agent.owner = event.params.to;
    agent.updatedAt = event.block.timestamp;
    agent.save();
  }
}
