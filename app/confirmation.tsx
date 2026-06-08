import { colors, radius, spacing } from "@/constants/theme";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Confirmation() {
  return (
    <View style={styles.container}>
      {/* Logo clair */}
      <Image
        source={require("@/assets/images/mascot-light.png")}
        style={styles.mascot}
        resizeMode="contain"
      />

      {/* Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.title}>Compte créé avec succès</Text>
        <Text style={styles.subtitle}>Bienvenue sur Le Bon Fournisseur.</Text>
      </View>

      {/* CTA */}
      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(app)/suppliers")}
      >
        <Text style={styles.buttonText}>Commencer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  mascot: {
    width: 100,
    height: 200,
  },
  messageContainer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primaryForeground,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryForeground,
    opacity: 0.8,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primaryForeground,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
