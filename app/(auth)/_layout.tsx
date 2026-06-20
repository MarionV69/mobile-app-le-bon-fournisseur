import { colors, spacing } from "@/constants/theme";
import { Slot } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={140}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>La marketplace des pros</Text>
        </View>

        {/* Form */}
        <Slot />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  logo: {
    width: 200,
    height: 50,
  },
  tagline: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
});
