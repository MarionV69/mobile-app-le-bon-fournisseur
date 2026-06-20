import { getConversations } from "@/api/conversations";
import MessageBubble from "@/components/conversations/MessageBubble";
import MessageInput from "@/components/conversations/MessageInput";
import { colors, sharedStyles, spacing } from "@/constants/theme";
import useConversationMessages from "@/hooks/useConversationMessages";
import { useUnread } from "@/hooks/useUnread";
import type { Conversation } from "@/types/conversations.types";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, MessageSquare, User } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function ConversationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const { refreshUnreadCount } = useUnread();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  const fetchConversation = useCallback(async () => {
    try {
      const data = await getConversations();
      const found = data.find((c) => c.id === conversationId);
      setConversation(found ?? null);
    } catch (err) {
      console.error("Error fetching conversation:", err);
    } finally {
      setConversationsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const { messages, loading, error, handleMessageSent } =
    useConversationMessages(
      conversationId,
      conversation?.unreadCount,
      refreshUnreadCount,
      fetchConversation,
    );

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  if (loading || conversationsLoading) {
    return (
      <View style={sharedStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={sharedStyles.centered}>
        <Text style={styles.notFoundText}>Conversation introuvable</Text>
        <Pressable onPress={() => router.back()} style={styles.backButtonAlt}>
          <Text style={styles.backButtonAltText}>Retour aux conversations</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      {/* Header */}
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft width={22} height={22} color={colors.foreground} />
        </Pressable>

        {conversation.otherParticipant.avatarUrl ? (
          <Image
            source={{ uri: conversation.otherParticipant.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User width={18} height={18} color={colors.mutedForeground} />
          </View>
        )}

        <Text style={styles.headerName} numberOfLines={1}>
          {conversation.otherParticipant.name}
        </Text>
      </View>

      {/* Messages */}
      {error && <Text style={styles.error}>{error}</Text>}

      {messages.length === 0 ? (
        <View style={sharedStyles.centered}>
          <MessageSquare width={48} height={48} color={colors.border} />
          <Text style={styles.emptyText}>
            {"Aucun message pour l'instant."}
          </Text>
          <Text style={styles.emptySubtext}>Envoyez le premier message !</Text>
        </View>
      ) : (
        <FlatList
          data={reversedMessages}
          inverted
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
        />
      )}

      {/* Input */}
      <MessageInput
        conversationId={conversation.id}
        onMessageSent={handleMessageSent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  headerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
  },
  error: {
    color: colors.destructive,
    textAlign: "center",
    paddingVertical: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  notFoundText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: spacing.md,
  },
  backButtonAlt: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  backButtonAltText: {
    fontSize: 14,
    color: colors.foreground,
  },
});
