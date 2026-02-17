import { PaymentReceived, PaymentVerified } from "../generated/BotInPaymentVault/BotInPaymentVault";
import { Agent, Payment, Subscription, Tier } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handlePaymentReceived(event: PaymentReceived): void {
  let paymentId = event.params.agentId.toString() + "-" + event.transaction.hash.toHex();
  let payment = new Payment(paymentId);

  payment.agent = event.params.agentId.toString();
  payment.payer = event.params.payer;
  payment.amount = event.params.amount;
  payment.tier = event.params.tier.toI32();
  payment.transactionHash = event.params.transactionHash;
  payment.timestamp = event.block.timestamp;
  payment.verified = false;

  payment.save();
}

export function handlePaymentVerified(event: PaymentVerified): void {
  let agentId = event.params.agentId.toString();

  let subscriptionId = agentId + "-" + event.transaction.hash.toHex();
  let subscription = new Subscription(subscriptionId);
  subscription.agent = agentId;
  subscription.tier = event.params.tier.toI32();
  subscription.startedAt = event.block.timestamp;
  subscription.expiresAt = event.params.expiry;
  subscription.isActive = true;
  subscription.save();

  let agent = Agent.load(agentId);
  if (agent) {
    agent.subscriptionTier = event.params.tier.toI32();
    agent.subscriptionExpiry = event.params.expiry;
    agent.save();
  }
}
