import { StyleSheet } from "react-native";

export const colors = {
  // Général
  background: "#ffffff",
  foreground: "#333333",

  // Card
  card: "#f2f2f7",
  cardForeground: "#333333",

  // Muted
  muted: "#f2f2f7",
  mutedForeground: "#9e9e9e",

  // Le Bon Fournisseur
  primary: "#3e1013",
  primaryForeground: "#f3f2e0",
  primaryMid: "#7a282a",

  // Erreurs
  destructive: "#e3131c",

  // Inputs
  input: "#f2f2f7",
  inputBorder: "#d4d4d8",
  border: "#e2e2e7",
};

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  pill: 100,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  heading: "Helvetica Neue, Helvetica, Arial, sans-serif",
  body: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

export const sharedStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
