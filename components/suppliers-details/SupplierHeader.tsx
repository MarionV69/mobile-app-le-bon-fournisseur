import type { supplierDetails } from "@/types/supplierDetails.type";
import { Euro, Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SupplierHeaderProps = {
  supplier: supplierDetails;
  labels: { id: number; name: string; description: string }[];
  categories: { id: number; name: string }[];
  isFavorite: boolean;
  onFavoriteToggle: () => void;
};

const priceRangeLabel: Record<string, string> = {
  MID_RANGE: "Milieu de gamme",
  PREMIUM: "Premium",
  ECONOMIC: "Économique",
};

export default function SupplierHeader({
  supplier,
  labels,
  categories,
  isFavorite,
  onFavoriteToggle,
}: SupplierHeaderProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFavoritePress() {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onFavoriteToggle();
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Nom + catégories */}
        <View style={styles.nameAndCategories}>
          <Text style={styles.name}>{supplier.name}</Text>
          <View style={styles.categoriesRow}>
            {supplier.productCategories.map((id, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {categories.find((c) => c.id === id)?.name ??
                    "Catégorie introuvable"}
                </Text>
              </View>
            ))}
          </View>
        </View>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleFavoritePress}
          >
            <Heart
              size={18}
              color="#3e1013"
              fill={isFavorite ? "#3e1013" : "transparent"}
            />
          </TouchableOpacity>
      </View>

      {/* Ville + prix + note */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.mutedText}>{supplier.city}</Text>
        </View>

        <View style={styles.infoItem}>
          <Euro size={10} color="#6b7280" />
          {supplier.priceRange !== "ECONOMIC" && (
            <Euro size={10} color="#6b7280" />
          )}
          {supplier.priceRange === "PREMIUM" && (
            <Euro size={10} color="#6b7280" />
          )}
          <Text style={styles.mutedText}>
            {priceRangeLabel[supplier.priceRange]}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Star size={14} color="#facc15" fill="#facc15" />
          <Text>{supplier.averageRating}</Text>
          <Text
            style={styles.mutedText}
          >{`(${supplier.reviewsCount} avis)`}</Text>
        </View>
      </View>

      {/* Labels */}
      <View style={styles.labelsRow}>
        {supplier.labels.map((id, index) => (
          <View key={index} style={styles.label}>
            <Text style={styles.labelText}>
              {labels.find((l) => l.id === id)?.name ?? "Label introuvable"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 48,
    marginBottom: 12,
  },
  nameAndCategories: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  categoryBadge: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  mutedText: {
    color: "#6b7280",
    fontSize: 13,
  },
  labelsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  label: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  labelText: {
    fontSize: 11,
    color: "#374151",
  },
  favoriteBtn: {
    backgroundColor: "white",
    borderColor: "#e1e1e1",
    borderWidth: 1,
    padding: 6,
    borderRadius: 999,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
});
