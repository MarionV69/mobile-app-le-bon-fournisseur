import { AuthProvider } from "@/context/AuthProvider";
import { FavoritesProvider } from "@/context/FavoritesProvider";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Slot />
      </FavoritesProvider>
    </AuthProvider>
  );
}
