import { getUnreadCount } from "@/api/conversations";
import { useCallback, useState, type ReactNode } from "react";
import { UnreadContext } from "./UnreadContext";

export function UnreadProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

  return (
    <UnreadContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
}
