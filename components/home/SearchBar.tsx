import { MapPin, Search } from "lucide-react-native";
import { StyleSheet, TextInput, View  } from "react-native";

type SearchBarProps = {
  search: string,
  city: string,
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
};

export default function SearchBar({ search, city, onSearchChange, onCityChange }: SearchBarProps) {

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
        <MapPin size={16} color="#6b7280" />
        <TextInput
          style={styles.input}
          placeholder="Ville..."
          placeholderTextColor="#9ca3af"
          value={city}
          onChangeText={onCityChange}
        />
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
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
});
