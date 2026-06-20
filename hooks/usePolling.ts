import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export function usePolling(callback: () => void, intervalMs: number) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();

    const interval = setInterval(() => {
      if (AppState.currentState !== "active") return;
      callbackRef.current();
    }, intervalMs);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        callbackRef.current();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [intervalMs]);
}
