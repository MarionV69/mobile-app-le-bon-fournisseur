import { createConversation } from "@/api/conversations";
import { colors, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet } from "react-native";

type ContactButtonProps = {
  supplierId: number;
};

export default function ContactButton({ supplierId }: ContactButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleContactClick() {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Connectez-vous pour contacter ce fournisseur.",
      );
      return;
    }

    setLoading(true);
    try {
      const conversation = await createConversation(supplierId);
      router.push(`/(app)/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      Alert.alert("Erreur", "Erreur lors de la création de la conversation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={handleContactClick}
      disabled={loading}
      accessibilityLabel="Contacter le fournisseur"
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.primaryForeground} />
      ) : (
        <MessageCircle
          width={18}
          height={18}
          color={colors.primaryForeground}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 40,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
