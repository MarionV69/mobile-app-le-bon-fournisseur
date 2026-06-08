import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      {/* User info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.role}>Restaurateur</Text>
      </View>

      {/* Logout button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <LogOut width={18} height={18} color={colors.primary} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    justifyContent: "space-between",
    paddingBottom: 70,
  },
  userInfo: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground,
  },
  role: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
  },
});
