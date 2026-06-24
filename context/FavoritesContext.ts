import { FavoritesSimple } from "@/types/favorites.types";
import { createContext } from "react";

export type FavoritesContextType = {
    favorites: FavoritesSimple[];
    handleFavoriteToggle: (supplierId: number) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextType | null>(null);