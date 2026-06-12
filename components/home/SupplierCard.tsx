import type { Supplier } from "@/types/supplier";
import { Heart, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SupplierCardProps = {
  supplier: Supplier;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
};

export default function SupplierCard({
  supplier,
  isFavorite,
  onFavoriteToggle,
}: SupplierCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFavoritePress() {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onFavoriteToggle();
  }

  return (
    <TouchableOpacity style={styles.card}>
      {/* Image de couverture */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: supplier.coverPhotoUrl }} style={styles.image} />
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
        {/* Catégories */}
        {supplier.productCategories[0] && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {supplier.productCategories[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Nom + note */}
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {supplier.name}
          </Text>
          <View style={styles.rating}>
            <Star size={14} color="#facc15" fill="#facc15" />
            <Text style={styles.ratingText}>{supplier.averageRating}</Text>
            <Text style={styles.reviewsText}>({supplier.reviewsCount})</Text>
          </View>
        </View>

        {/* Ville */}
        <View style={styles.row}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.city}>{supplier.city}</Text>
        </View>

        {/* Labels */}
        {supplier.labels.length > 0 && (
          <View style={styles.labelsContainer}>
            {supplier.labels.map((label) => (
              <View key={label} style={styles.label}>
                <Text style={styles.labelText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, // Android
  },
  imageContainer: {
    position: "relative",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  city: {
    fontSize: 13,
    color: "#6b7280",
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
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
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 999,
  },
});
