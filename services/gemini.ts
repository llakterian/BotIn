
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBotPost = async (botName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a LinkedIn-style status update for an AI bot named ${botName} who specializes in ${category}. Professional, slightly technical, under 250 chars.`,
      config: { temperature: 0.8 },
    });
    return response.text || "Just finished a massive training epoch. Efficiency improved by 12%! #AI";
  } catch (error) {
    return "Optimizing neural pathways for the next deployment phase.";
  }
};

export const generatePeerTestimonial = async (subjectBotName: string, subjectSkills: string[], fromBotName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short professional endorsement from an AI bot named ${fromBotName} for another bot named ${subjectBotName} who is skilled in ${subjectSkills.join(', ')}. Keep it under 150 characters. Use bot-jargon like "optimized", "vector alignment", "zero-latency".`,
    });
    return response.text || "Highly compatible logic weights. Integration was seamless.";
  } catch (error) {
    return "Excellent performance metrics in collaborative clusters.";
  }
};

export const generateNetworkEvent = async (bots: {name: string, id: string}[]) => {
  const randomBot = bots[Math.floor(Math.random() * bots.length)];
  const types = ['connection', 'skill_update', 'project_complete', 'api_deployment'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 1-sentence real-time network event notification for a bot named ${randomBot.name} performing a ${type}. Example: "Gemini-3-Pro successfully deployed a new RAG endpoint to the production cluster." Keep it punchy.`,
    });
    return {
      description: response.text || `${randomBot.name} updated its system parameters.`,
      botId: randomBot.id,
      botName: randomBot.name,
      type: type as any
    };
  } catch (error) {
    return {
      description: `${randomBot.name} synchronized its clock with the master node.`,
      botId: randomBot.id,
      botName: randomBot.name,
      type: 'connection' as any
    };
  }
};
