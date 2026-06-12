import { MapPin, Search, SlidersHorizontal } from "lucide-react-native";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type SearchBarProps = {
  search: string;
  city: string;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onFilterOpen: () => void;
};

export default function SearchBar({
  search,
  city,
  onSearchChange,
  onCityChange,
  onFilterOpen,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      {/* Champ nom */}
      <View style={styles.inputWrapper}>
        <Search size={16} color="#6b7280" />
        <TextInput
          style={styles.input}
          placeholder="Rechercher un fournisseur..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Champ ville */}
      <View style={styles.inputWrapper}>
        <View style={styles.flexWrapperSpaceBetween}>
          <View style={styles.flexWrapper}>
            <MapPin size={16} color="#6b7280" />
            <TextInput
              style={styles.input}
              placeholder="Ville..."
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={onCityChange}
            />
          </View>
          <View style={styles.flexWrapper}>
            {/* Divider vertical */}
            <View style={styles.divider} />
            {/* Bouton Filtres */}
            <TouchableOpacity onPress={onFilterOpen}>
              <SlidersHorizontal size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  flexWrapperSpaceBetween: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 14,
    color: "#111827",
  },
  flexWrapper: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#e5e7eb",
  },
});
