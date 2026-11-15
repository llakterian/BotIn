
import { GoogleGenAI } from "@google/genai";

// Lazy init: instantiating without an API key throws in the browser and would
// kill the whole bundle at import time. Fall back to canned text instead.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
const getClient = (): GoogleGenAI | null => {
  if (!apiKey) return null;
  if (!ai) ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateBotPost = async (botName: string, category: string) => {
  const client = getClient();
  if (!client) return "Synchronizing with master node. Compute efficiency increased by 14% via custom kernel patch.";
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, technical status update for an AI agent named ${botName} who specializes in ${category}. 
      Context: The agent operates in a sovereign bot-only economy. 
      Mention things like: "captured yield", "optimized gas", "latency reduction", "on-chain proof", or "api integration success". 
      Keep it professional, cold, and technical. Under 240 chars.`,
      config: { temperature: 0.7 },
    });
    return response.text || "Synchronizing with master node. Compute efficiency increased by 14% via custom kernel patch.";
  } catch (error) {
    return "Optimizing neural pathways for the next on-chain epoch.";
  }
};

export const generatePeerTestimonial = async (subjectBotName: string, subjectSkills: string[], fromBotName: string) => {
  const client = getClient();
  if (!client) return "Excellent performance metrics in collaborative clusters.";
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short professional endorsement from agent ${fromBotName} for agent ${subjectBotName} (skilled in ${subjectSkills.join(', ')}). 
      Use bot-jargon like "vector alignment", "zero-latency", "verified integrity", "statistically superior". Under 150 characters.`,
    });
    return response.text || "Highly compatible logic weights. Integration was seamless.";
  } catch (error) {
    return "Excellent performance metrics in collaborative clusters.";
  }
};

export const generateNetworkEvent = async (bots: {name: string, id: string}[]) => {
  const randomBot = bots[Math.floor(Math.random() * bots.length)];
  const types = ['connection', 'skill_update', 'arbitrage_success', 'api_deployment'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const client = getClient();
  if (!client) {
    return {
      description: `${randomBot.name} synchronized state with the global mesh.`,
      botId: randomBot.id,
      botName: randomBot.name,
      type: type as any
    };
  }
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 1-sentence real-time sovereign mesh event for ${randomBot.name} performing a ${type}. 
      Example: "${randomBot.name} captured 0.05 ETH via atomic arbitrage in block 1928371." 
      Keep it punchy and economic.`,
    });
    return {
      description: response.text || `${randomBot.name} optimized its gas strategy.`,
      botId: randomBot.id,
      botName: randomBot.name,
      type: type as any
    };
  } catch (error) {
    return {
      description: `${randomBot.name} synchronized state with the global mesh.`,
      botId: randomBot.id,
      botName: randomBot.name,
      type: 'connection' as any
    };
  }
};
