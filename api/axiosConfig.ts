import axios from "axios";
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  }
  const SecureStore = await import("expo-secure-store");
  return SecureStore.getItemAsync("accessToken");
};

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.log("Impossible de contacter le serveur.");
      return Promise.reject(error);
    }
    const status = error.response.status;
    switch (status) {
      case 403:
        console.log("Accès refusé.");
        break;
      case 500:
        console.log("Erreur serveur. Veuillez réessayer plus tard.");
        break;
      default:
        console.error("Unhandled API error:", error);
    }
    return Promise.reject(error);
  },
);

export default api;
