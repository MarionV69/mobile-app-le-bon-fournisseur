import Filters from "@/components/home/Filters";
import SearchBar from "@/components/home/SearchBar";
import SupplierCard from "@/components/home/SupplierCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useSuppliers } from "@/hooks/useSuppliers";
import { filtersType } from "@/types/filters.types";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <ScrollView style={styles.main}>
      <View>
        <SearchBar
          search={search}
          city={city}
          onSearchChange={setSearch}
          onCityChange={setCity}
        />
        <TouchableOpacity onPress={() => setIsFilterOpen(true)}>
          <SlidersHorizontal size={20} color="#6b7280" />
        </TouchableOpacity>
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
