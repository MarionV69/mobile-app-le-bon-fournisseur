import { colors, sharedStyles } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  // const { user, loading } = useAuth();

  // if (loading) {
  //   return (
  //     <View style={sharedStyles.centered}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  // if (!user) return <Redirect href="/(auth)/login" />;
  // if (!user.establishmentId)
  //   return <Redirect href="/(auth)/create-establishment" />;

  return <Redirect href="/(app)/suppliers" />;
}
