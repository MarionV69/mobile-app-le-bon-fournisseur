import { colors, radius, spacing } from "@/constants/theme";
import { supplierDetails } from "@/types/supplierDetails.type";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilesSectionType = {
  supplier: supplierDetails;
};

export default function FilesSection({ supplier }: FilesSectionType) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.triggerText}>Documents</Text>
        {isOpen ? (
          <ChevronUp size={18} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={18} color={colors.mutedForeground} />
        )}
      </TouchableOpacity>

      {/* Contenu */}
      {isOpen && (
        <View style={styles.content}>
          {supplier.catalogs.length === 0 ? (
            <Text style={styles.emptyText}>Aucun document disponible.</Text>
          ) : (
            supplier.catalogs.map((catalog) => (
              <TouchableOpacity
                key={catalog.id}
                style={styles.fileRow}
                onPress={() => Linking.openURL(catalog.url)}
              >
                <Text style={styles.fileName} numberOfLines={1}>
                  {catalog.originalFilename}
                </Text>
                <Text style={styles.fileSize}>
                  {(catalog.size / 1024).toFixed(0)} Ko
                </Text>
                <ExternalLink size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            ))
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
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
  },
  fileSize: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
});
