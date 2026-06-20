import { getAttachmentUrl } from "@/api/conversations";
import { colors, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import type { Message } from "@/types/conversations.types";
import { FileText, Image as ImageIcon } from "lucide-react-native";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type MessageBubbleProps = {
  message: Message;
};

function formatTime(date: Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return messageDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return messageDate.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();
  const isMine = message.senderType === user?.establishmentType;

  async function handleOpenAttachment(endpoint: string) {
    try {
      const url = await getAttachmentUrl(endpoint);
      await Linking.openURL(url);
    } catch (err) {
      console.error("Error opening attachment:", err);
    }
  }

  return (
    <View
      style={[styles.container, isMine ? styles.alignRight : styles.alignLeft]}
    >
      <Text style={styles.timestamp}>{formatTime(message.sentAt)}</Text>

      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleTheirs,
        ]}
      >
        {!!message.content && (
          <Text style={[styles.content, isMine && styles.contentMine]}>
            {message.content}
          </Text>
        )}

        {message.attachments.length > 0 && (
          <View style={styles.attachments}>
            {message.attachments.map((attachment) => {
              const isImage = attachment.mimeType.startsWith("image/");
              return (
                <Pressable
                  key={attachment.id}
                  style={styles.attachmentButton}
                  onPress={() => handleOpenAttachment(attachment.endpoint)}
                >
                  {isImage ? (
                    <ImageIcon
                      width={16}
                      height={16}
                      color={
                        isMine ? colors.primaryForeground : colors.foreground
                      }
                    />
                  ) : (
                    <FileText
                      width={16}
                      height={16}
                      color={
                        isMine ? colors.primaryForeground : colors.foreground
                      }
                    />
                  )}
                  <Text
                    style={[
                      styles.attachmentName,
                      isMine && styles.attachmentNameMine,
                    ]}
                    numberOfLines={1}
                  >
                    {attachment.originalFilename}
                  </Text>
                  <Text
                    style={[
                      styles.attachmentSize,
                      isMine && styles.attachmentSizeMine,
                    ]}
                  >
                    ({(attachment.size / 1024).toFixed(0)} Ko)
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  alignRight: {
    alignItems: "flex-end",
  },
  alignLeft: {
    alignItems: "flex-start",
  },
  timestamp: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 2,
  },
  bubbleTheirs: {
    backgroundColor: colors.muted,
    borderTopLeftRadius: 2,
  },
  content: {
    fontSize: 14,
    color: colors.foreground,
  },
  contentMine: {
    color: colors.primaryForeground,
  },
  attachments: {
    marginTop: spacing.xs,
    gap: 4,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  attachmentName: {
    fontSize: 13,
    color: colors.foreground,
    flexShrink: 1,
  },
  attachmentNameMine: {
    color: colors.primaryForeground,
  },
  attachmentSize: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  attachmentSizeMine: {
    color: colors.primaryForeground,
    opacity: 0.7,
  },
});
