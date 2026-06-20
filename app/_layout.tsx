import { AuthProvider } from "@/context/AuthProvider";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <Slot />
          </SafeAreaView>
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
