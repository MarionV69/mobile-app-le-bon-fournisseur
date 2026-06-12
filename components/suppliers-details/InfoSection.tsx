import { colors, radius, spacing } from "@/constants/theme";
import { supplierDetails } from "@/types/supplierDetails.type";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SupplierProps = {
  supplier: supplierDetails;
};

export default function InfoSection({ supplier }: SupplierProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.triggerText}>Informations pratiques</Text>
        {isOpen ? (
          <ChevronUp size={18} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={18} color={colors.mutedForeground} />
        )}
      </TouchableOpacity>

      {/* Contenu */}
      {isOpen && (
        <View style={styles.content}>
          {supplier.minimumOrderAmount && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>COMMANDE MINIMUM</Text>
              <Text style={styles.cardValue}>
                {Number(supplier.minimumOrderAmount).toFixed(0)}€
              </Text>
            </View>
          )}
          {supplier.deliveryRadiusKm && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ZONE DE LIVRAISON</Text>
              <Text style={styles.cardValue}>
                {supplier.deliveryRadiusKm}km autour de {supplier.city}
              </Text>
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
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 15,
    color: colors.foreground,
    fontWeight: "500",
  },
});
