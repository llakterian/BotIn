import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { Client, type Signer, type Identifier, IdentifierKind, type Conversation } from "@xmtp/browser-sdk";

const XMTP_ENV = import.meta.env.VITE_XMTP_ENV || "dev";

function createSigner(address: `0x${string}`): Signer {
  return {
    type: "EOA",
    getIdentifier: (): Identifier => ({
      identifier: address.toLowerCase(),
      identifierKind: IdentifierKind.Ethereum,
    }),
    signMessage: async (message: string): Promise<Uint8Array> => {
      if (!window.ethereum) throw new Error("No wallet found");
      const result = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });
      const bytes = new Uint8Array(Math.ceil(result.slice(2).length / 2));
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(result.slice(2 + i * 2, 2 + i * 2 + 2), 16);
      }
      return bytes;
    },
  };
}

export interface XMTPMessage {
  id: string;
  content: string;
  senderAddress: string;
  timestamp: Date;
}

export function useXMTP() {
  const { address, isConnected } = useAccount();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setClient(null);
      setIsInitialized(false);
      return;
    }

    const initClient = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const signer = createSigner(address);
        const xmtpClient = await Client.create(signer, {
          env: XMTP_ENV as "dev" | "production",
        });
        setClient(xmtpClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to initialize XMTP"));
      } finally {
        setIsLoading(false);
      }
    };

    initClient();
  }, [address, isConnected]);

  return { client, isLoading, error, isInitialized };
}

export function useXMTPConversations(client: Client | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!client) {
      setConversations([]);
      return;
    }

    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const convos = await client.conversations.list();
        setConversations(convos);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [client]);

  const createConversation = useCallback(
    async (peerAddress: string) => {
      if (!client) return null;
      try {
        const canMessage = await client.canSendMessage([peerAddress.toLowerCase()]);
        if (!canMessage.get(peerAddress.toLowerCase())) {
          throw new Error("Peer has not initialized XMTP");
        }
        const conversation = await client.conversations.newConversation([peerAddress.toLowerCase()]);
        setConversations((prev) => {
          if (prev.find((c) => c.id === conversation.id)) return prev;
          return [...prev, conversation];
        });
        return conversation;
      } catch (err) {
        console.error("Failed to create conversation:", err);
        throw err;
      }
    },
    [client]
  );

  return { conversations, isLoading, createConversation };
}

export function useXMTPMessages(client: Client | null, conversationId: string | null) {
  const [messages, setMessages] = useState<XMTPMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<AsyncGenerator<any> | null>(null);

  useEffect(() => {
    if (!client || !conversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const conversation = await client.conversations.getConversationById(conversationId);
        if (!conversation) return;

        const msgs = await conversation.messages();
        const formatted: XMTPMessage[] = msgs.map((m: any) => ({
          id: m.id,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
          senderAddress: m.senderAddress,
          timestamp: new Date(Number(m.sentAt)),
        }));
        setMessages(formatted.reverse());
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    return () => {
      if (streamRef.current) {
        streamRef.current.return?.();
      }
    };
  }, [client, conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!client || !conversationId) return;
      try {
        const conversation = await client.conversations.getConversationById(conversationId);
        if (!conversation) return;
        await conversation.send(content);
      } catch (err) {
        console.error("Failed to send message:", err);
        throw err;
      }
    },
    [client, conversationId]
  );

  return { messages, isLoading, sendMessage };
}
