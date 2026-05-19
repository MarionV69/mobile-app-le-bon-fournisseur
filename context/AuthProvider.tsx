import { useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import { loginApi, registerApi } from "../api/auth";
import { getProfile } from "../api/users";
import type { LoggedUser, RegisterDto } from "../types/auth.types";
import { AuthContext } from "./AuthContext";

const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") return localStorage.getItem("accessToken");
  const SecureStore = await import("expo-secure-store");
  return SecureStore.getItemAsync("accessToken");
};

const setToken = async (token: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem("accessToken", token);
    return;
  }
  const SecureStore = await import("expo-secure-store");
  await SecureStore.setItemAsync("accessToken", token);
};

const removeToken = async (): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.removeItem("accessToken");
    return;
  }
  const SecureStore = await import("expo-secure-store");
  await SecureStore.deleteItemAsync("accessToken");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      if (token) {
        try {
          const userData = await getProfile();
          setUser({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            establishmentId: userData.establishmentId,
            establishmentType: userData.establishmentType,
          });
        } catch {
          await removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<LoggedUser> => {
    const response = await loginApi(email, password);
    await setToken(response.access_token);
    const loggedUser: LoggedUser = {
      id: response.user.id,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      role: response.user.role,
      establishmentId: response.user.establishmentId,
      establishmentType: response.user.establishmentType,
    };
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (dto: RegisterDto): Promise<LoggedUser> => {
    const response = await registerApi(dto);
    await setToken(response.access_token);
    const registeredUser: LoggedUser = {
      id: response.user.id,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      role: response.user.role,
      establishmentId: response.user.establishmentId,
      establishmentType: response.user.establishmentType,
    };
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async (): Promise<void> => {
    await removeToken();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const userData = await getProfile();
    setUser({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      establishmentId: userData.establishmentId,
      establishmentType: userData.establishmentType,
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
