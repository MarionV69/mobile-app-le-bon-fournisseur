import Filters from "@/components/suppliers/Filters";
import SearchBar from "@/components/suppliers/SearchBar";
import SupplierCard from "@/components/suppliers/SupplierCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSuppliers } from "@/hooks/useSuppliers";
import { filtersType } from "@/types/filters.types";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Suppliers() {
  const [search, setSearch] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [filters, setFilters] = useState<filtersType>({
    productCategories: [],
    labels: [],
    minRating: 0,
    priceRange: [],
    isPremium: false,
  });
  const { suppliers, error, loading } = useSuppliers(search, city, filters);
  const { favorites, handleFavoriteToggle } = useFavorites();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <ScrollView style={styles.main}>
      <View>
        <SearchBar
          search={search}
          city={city}
          onSearchChange={setSearch}
          onCityChange={setCity}
          onFilterOpen={() => setIsFilterOpen(true)}
        />
      </View>
      {loading ? (
        <Text>Chargement en cours...</Text>
      ) : (
        <View>
          {error && <Text>{error}</Text>}
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              isFavorite={favorites.some((fav) => fav.targetId === supplier.id)}
              onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
            />
          ))}
        </View>
      )}
      <Filters
        filters={filters}
        isOpen={isFilterOpen}
        onChange={setFilters}
        onClose={() => setIsFilterOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 48,
    marginBottom: 96,
    padding: 24,
  },
});
