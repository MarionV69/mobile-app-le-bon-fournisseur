import { colors, sharedStyles } from "@/constants/theme";
import { UnreadProvider } from "@/context/UnreadProvider";
import { useAuth } from "@/hooks/useAuth";
import { usePolling } from "@/hooks/usePolling";
import { useUnread } from "@/hooks/useUnread";
import { Redirect, Tabs } from "expo-router";
import { Heart, MessageCircle, Search, User } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function TabsLayout() {
  const { user, loading } = useAuth();
  const { unreadCount, refreshUnreadCount } = useUnread();

  usePolling(refreshUnreadCount, 10_000);

  if (loading) {
    return (
      <View style={sharedStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;
  if (!user.establishmentId)
    return <Redirect href="/(auth)/create-establishment" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 64,
        },
        tabBarItemStyle: {
          paddingTop: 12,
        },
      }}
    >
      <Tabs.Screen
        name="suppliers"
        options={{
          tabBarAccessibilityLabel: "Recherche",
          tabBarIcon: ({ color, size }) => (
            <Search width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suppliers-details/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarAccessibilityLabel: "Favoris",
          tabBarIcon: ({ color, size }) => (
            <Heart width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          tabBarAccessibilityLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <View>
              <MessageCircle width={size} height={size} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <User width={size} height={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function AppLayout() {
  return (
    <UnreadProvider>
      <TabsLayout />
    </UnreadProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.destructive,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
});
