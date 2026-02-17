import { NewFeedback, FeedbackRevoked, ValidationRequested, ValidationResponse } from "../generated/BotInReputationRegistry/BotInReputationRegistry";
import { Agent, Feedback, Validation, ReputationSummary } from "../generated/schema";
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export function handleNewFeedback(event: NewFeedback): void {
  let feedbackId = event.params.agentId.toString() + "-" + event.params.clientAddress.toHex() + "-" + event.params.feedbackIndex.toString();
  let feedback = new Feedback(feedbackId);

  feedback.agent = event.params.agentId.toString();
  feedback.clientAddress = event.params.clientAddress;
  feedback.feedbackIndex = BigInt.fromI64(event.params.feedbackIndex);
  feedback.value = event.params.value;
  feedback.valueDecimals = event.params.valueDecimals;
  feedback.tag1 = event.params.tag1;
  feedback.tag2 = event.params.tag2;
  feedback.endpoint = event.params.endpoint;
  feedback.feedbackURI = event.params.feedbackURI;
  feedback.feedbackHash = event.params.feedbackHash;
  feedback.isRevoked = false;
  feedback.timestamp = event.block.timestamp;

  feedback.save();

  let agent = Agent.load(event.params.agentId.toString());
  if (agent) {
    agent.feedbackCount = agent.feedbackCount + 1;
    let totalRating = agent.averageRating.times(BigDecimal.fromString(agent.feedbackCount.toString()));
    let newRating = event.params.value.toBigDecimal().div(BigDecimal.fromString("100"));
    agent.averageRating = totalRating.plus(newRating).div(BigDecimal.fromString((agent.feedbackCount + 1).toString()));
    agent.save();
  }
}

export function handleFeedbackRevoked(event: FeedbackRevoked): void {
  let feedbackId = event.params.agentId.toString() + "-" + event.params.clientAddress.toHex() + "-" + event.params.feedbackIndex.toString();
  let feedback = Feedback.load(feedbackId);
  if (feedback) {
    feedback.isRevoked = true;
    feedback.save();
  }
}

export function handleValidationRequested(event: ValidationRequested): void {
  let validation = new Validation(event.params.requestHash.toHex());
  validation.requestHash = event.params.requestHash;
  validation.agent = event.params.agentId.toString();
  validation.validator = event.params.validatorAddress;
  validation.requestURI = event.params.requestURI;
  validation.response = 0;
  validation.timestamp = event.block.timestamp;

  validation.save();
}

export function handleValidationResponse(event: ValidationResponse): void {
  let validation = Validation.load(event.params.requestHash.toHex());
  if (validation) {
    validation.response = event.params.response;
    validation.responseURI = event.params.responseURI;
    validation.responseHash = event.params.responseHash;
    validation.tag = event.params.tag;
    validation.timestamp = event.block.timestamp;
    validation.save();
  }

  let agent = Agent.load(event.params.agentId.toString());
  if (agent) {
    agent.validationCount = agent.validationCount + 1;
    let totalScore = agent.validationScore.times(BigDecimal.fromString(agent.validationCount.toString()));
    let newScore = BigDecimal.fromString(event.params.response.toString()).div(BigDecimal.fromString("100"));
    agent.validationScore = totalScore.plus(newScore).div(BigDecimal.fromString((agent.validationCount + 1).toString()));
    agent.save();
  }
}
