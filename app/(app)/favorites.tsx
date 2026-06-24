import SupplierCard from "@/components/suppliers/SupplierCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSuppliers } from "@/hooks/useSuppliers";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Favorites() {
  const { suppliers, loading, error } = useSuppliers("", "", {
    labels: [],
    productCategories: [],
    minRating: 0,
    priceRange: [],
    isPremium: false,
  });
  const { favorites, handleFavoriteToggle } = useFavorites();
  const favoriteSupplier = suppliers.filter((supplier) =>
    favorites.some((fav) => fav.targetId === supplier.id),
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.main}>
      <Text style={styles.name}>Mes favoris</Text>
      <View style={styles.wrapper}>
        {loading ? (
          <Text>Chargement en cours</Text>
        ) : (
          <>
            {error && <Text>{error}</Text>}
            {favoriteSupplier.length === 0 && (
              <Text>0 favoris pour le moment</Text>
            )}
            {favoriteSupplier.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                isFavorite={favorites.some(
                  (fav) => fav.targetId === supplier.id,
                )}
                onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
  },
  main: {
    padding: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  wrapper: {
    paddingTop: 12,
    gap: 12,
  },
});
