import { createContext } from "react";

export type UnreadContextType = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
};

export const UnreadContext = createContext<UnreadContextType | null>(null);
