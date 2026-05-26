import SupplierCard from "@/components/SupplierCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";

export default function Suppliers() {
  const [search, setSearch] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const { suppliers, error, loading } = useSuppliers(search, city);
  const { favorites, handleFavoriteToggle } = useFavorites();

  return (
    <ScrollView style={styles.main}>
      <View>
        {suppliers.map((supplier) => (
            <SupplierCard 
              key={supplier.id}
              supplier={supplier} 
              isFavorite={favorites.some(
                (fav) => fav.targetId === supplier.id,
              )}
              onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
            />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 48,
    marginBottom: 96, 
    padding: 24,
  }
  
});