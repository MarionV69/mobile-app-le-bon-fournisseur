import { colors, radius, spacing } from "@/constants/theme";
import { supplierDetails } from "@/types/supplierDetails.type";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type GallerySectionType = {
  supplier: supplierDetails;
};

const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - spacing.md * 2 - spacing.sm * 2) / 3;

export default function GallerySection({ supplier }: GallerySectionType) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.triggerText}>Galerie</Text>
        {isOpen ? (
          <ChevronUp size={18} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={18} color={colors.mutedForeground} />
        )}
      </TouchableOpacity>

      {/* Contenu */}
      {isOpen && (
        <View style={styles.content}>
          {supplier.galleryPhotos.length === 0 ? (
            <Text style={styles.emptyText}>Aucune photo disponible.</Text>
          ) : (
            <View style={styles.grid}>
              {supplier.galleryPhotos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.photo}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginLeft: 24,
    marginRight: 24,
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
  },
  content: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  photo: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius.md,
    resizeMode: "cover",
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
});
