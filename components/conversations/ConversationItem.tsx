import { colors, radius, spacing } from "@/constants/theme";
import type { Conversation } from "@/types/conversations.types";
import { router } from "expo-router";
import { User } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ConversationItemProps = {
  conversation: Conversation;
};

function formatRelativeTime(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";

  return messageDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/(app)/conversations/${conversation.id}`)}
    >
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {conversation.otherParticipant.avatarUrl ? (
          <Image
            source={{ uri: conversation.otherParticipant.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User width={20} height={20} color={colors.mutedForeground} />
          </View>
        )}
        {conversation.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Name + Date */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.otherParticipant.name}
          </Text>
          <Text style={styles.date}>
            {formatRelativeTime(conversation.lastMessageAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.destructive,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.foreground,
  },
  date: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
});
