import { getConversations } from "@/api/conversations";
import ConversationItem from "@/components/conversations/ConversationItem";
import { colors, sharedStyles, spacing } from "@/constants/theme";
import { usePolling } from "@/hooks/usePolling";
import type { Conversation } from "@/types/conversations.types";
import { MessageSquare } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ConversationsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Erreur lors du chargement des conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  usePolling(fetchConversations, 10_000);

  if (loading) {
    return (
      <View style={sharedStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversations</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageSquare width={48} height={48} color={colors.border} />
          <Text style={styles.emptyText}>
            {"Aucune conversation pour l'instant."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ConversationItem conversation={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  error: {
    color: colors.destructive,
    textAlign: "center",
    paddingVertical: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  listContent: {
    paddingBottom: 80,
  },
});
