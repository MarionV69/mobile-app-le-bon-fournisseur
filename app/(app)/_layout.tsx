import { colors, sharedStyles } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Tabs } from "expo-router";
import { Heart, MessageCircle, Search, User } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { user, loading } = useAuth();

  console.log("AppLayout - user:", user, "loading:", loading);

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
          borderTopColor: "transparent",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
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
          tabBarStyle: { display: "none"},
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
            <MessageCircle width={size} height={size} color={color} />
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
