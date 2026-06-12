import { colors, radius, spacing } from "@/constants/theme";
import { supplierDetails } from "@/types/supplierDetails.type";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SupplierProps = {
  supplier: supplierDetails;
};

export default function AboutSection({ supplier }: SupplierProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.triggerText}>À propos</Text>
        {isOpen ? (
          <ChevronUp size={18} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={18} color={colors.mutedForeground} />
        )}
      </TouchableOpacity>

      {/* Contenu */}
      {isOpen && (
        <View style={styles.content}>
          <Text style={styles.description}>
            {supplier.description ?? "Aucune description renseignée par le fournisseur."}
          </Text>
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
  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 22,
  },
});