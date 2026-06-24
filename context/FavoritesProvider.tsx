import api from "@/api/axiosConfig";
import { useAuth } from "@/hooks/useAuth";
import { FavoritesSimple } from "@/types/favorites.types";
import { ReactNode, useEffect, useState } from "react";
import { FavoritesContext } from "./FavoritesContext";

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<FavoritesSimple[]>([]);
    const { user } = useAuth();
    const establishmentId = user?.establishmentId;

    // Fonction pour récupérer les favoris d'un établissement
    useEffect(() => {
      if (!user) return;
      async function getFavorites() {
        try {
          const response = await api.get(
            `/establishments/${establishmentId}/favorites`,
          );
          setFavorites(
            response.data.map((fav: { id: number; targetId: number }) => ({
              id: fav.id,
              targetId: fav.targetId,
            })),
          );
        } catch {
          console.error(
            "Impossible de charger les favoris pour le moment. Veuillez réessayer plus tard.",
          );
        }
      }
      getFavorites();
    }, [user, establishmentId]);

    // Fonction pour ajouter ou supprimer un favoris
    async function handleFavoriteToggle(supplierId: number) {
      if (!user) return;
      try {
        if (favorites.some((fav) => fav.targetId === supplierId)) {
          const favorite = favorites.find((fav) => fav.targetId === supplierId);
          await api.delete(
            `/establishments/${establishmentId}/favorites/${favorite?.id}`,
          );
          setFavorites(favorites.filter((fav) => fav.targetId !== supplierId));
        } else {
          const response = await api.post(
            `/establishments/${establishmentId}/favorites`,
            {
              targetId: supplierId,
            },
          );
          setFavorites([
            ...favorites,
            { id: response.data.id, targetId: supplierId },
          ]);
        }
      } catch {
        console.error(
          "Impossible de modifier les favoris pour le moment. Veuillez réessayer plus tard.",
        );
      }
    }

    return (
        <FavoritesContext.Provider value={{ favorites, handleFavoriteToggle}}>
            {children}
        </FavoritesContext.Provider>
    );
  }

