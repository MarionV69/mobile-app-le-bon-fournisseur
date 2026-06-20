import { getConversationMessages } from "@/api/conversations";
import type { Message } from "@/types/conversations.types";
import { useEffect, useState } from "react";

function useConversationMessages(
  conversationId: number,
  unreadCount: number | undefined,
  onRefresh: () => Promise<void>,
  onRefreshConversations: () => Promise<void>,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setError(null);
        const data = await getConversationMessages(conversationId);
        setMessages(data);
        await Promise.all([onRefresh(), onRefreshConversations()]);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Erreur lors du chargement des messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, unreadCount, onRefresh, onRefreshConversations]);

  const handleMessageSent = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    onRefreshConversations();
  };

  return { messages, loading, error, handleMessageSent };
}

export default useConversationMessages;
