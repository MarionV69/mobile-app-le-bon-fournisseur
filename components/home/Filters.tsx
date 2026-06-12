import { colors, radius, spacing } from "@/constants/theme";
import { filtersType } from "@/types/filters.types";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";

type FilterProps = {
  filters: filtersType;
  isOpen: boolean;
  onChange: (filters: filtersType) => void;
  onClose: () => void;
};

export default function Filters({ filters, isOpen, onChange, onClose }: FilterProps) {
  const CATEGORIES = [
    "Viandes", "Fruits & Légumes", "Poissons & Produits de la mer",
    "Produits laitiers & oeufs", "Boulangerie / Pâtisserie",
    "Épicerie sèche", "Produits surgelés", "Boissons",
  ];

  const LABELS = ["Bio", "Label Rouge", "AOP", "IGP", "HVE", "Origine France"];

  const PRICE_RANGE = [
    { label: "Économique", value: "ECONOMIC" },
    { label: "Milieu de gamme", value: "MID_RANGE" },
    { label: "Premium", value: "PREMIUM" },
  ];

  const RATINGS = [
    { label: "5 étoiles", value: 5 },
    { label: "4 étoiles et +", value: 4 },
    { label: "3 étoiles et +", value: 3 },
    { label: "Toutes les notes", value: 0 },
  ];

  function handleChangeCategory(category: string) {
    const isChecked = filters.productCategories.includes(category);
    onChange({
      ...filters,
      productCategories: isChecked
        ? filters.productCategories.filter((c) => c !== category)
        : [...filters.productCategories, category],
    });
  }

  function handleChangeLabel(label: string) {
    const isChecked = filters.labels.includes(label);
    onChange({
      ...filters,
      labels: isChecked
        ? filters.labels.filter((l) => l !== label)
        : [...filters.labels, label],
    });
  }

  function handleChangePriceRange(range: string) {
    const isChecked = filters.priceRange.includes(range);
    onChange({
      ...filters,
      priceRange: isChecked
        ? filters.priceRange.filter((p) => p !== range)
        : [...filters.priceRange, range],
    });
  }

  function handleReset() {
    onChange({ productCategories: [], labels: [], minRating: 0, priceRange: [], isPremium: false });
  }

  // Composant Checkbox custom
  function CustomCheckbox({ checked, onPress }: { checked: boolean; onPress: () => void }) {
    return (
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onPress}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  }

  // Composant Radio custom
  function CustomRadio({ selected, onPress }: { selected: boolean; onPress: () => void }) {
    return (
      <TouchableOpacity style={styles.radioOuter} onPress={onPress}>
        {selected && <View style={styles.radioInner} />}
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={isOpen} animationType="slide">
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filtres</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Catégories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CATÉGORIES</Text>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.row}
                onPress={() => handleChangeCategory(category)}
              >
                <CustomCheckbox
                  checked={filters.productCategories.includes(category)}
                  onPress={() => handleChangeCategory(category)}
                />
                <Text style={styles.rowLabel}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.separator} />

          {/* Labels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LABELS</Text>
            {LABELS.map((label) => (
              <TouchableOpacity
                key={label}
                style={styles.row}
                onPress={() => handleChangeLabel(label)}
              >
                <CustomCheckbox
                  checked={filters.labels.includes(label)}
                  onPress={() => handleChangeLabel(label)}
                />
                <Text style={styles.rowLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.separator} />

          {/* Prix */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRIX</Text>
            {PRICE_RANGE.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={styles.row}
                onPress={() => handleChangePriceRange(value)}
              >
                <CustomCheckbox
                  checked={filters.priceRange.includes(value)}
                  onPress={() => handleChangePriceRange(value)}
                />
                <Text style={styles.rowLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.separator} />

          {/* Note */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTE</Text>
            {RATINGS.map((rating) => (
              <TouchableOpacity
                key={rating.label}
                style={styles.row}
                onPress={() => onChange({ ...filters, minRating: rating.value })}
              >
                <CustomRadio
                  selected={filters.minRating === rating.value}
                  onPress={() => onChange({ ...filters, minRating: rating.value })}
                />
                <Text style={styles.rowLabel}>{rating.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.separator} />

          {/* Premium */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { flex: 1 }]}>Premium uniquement</Text>
              <Switch
                value={filters.isPremium}
                onValueChange={(value) => onChange({ ...filters, isPremium: value })}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Réinitialiser */}
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Réinitialiser les filtres</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyBtnText}>Appliquer les filtres</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: spacing.xl,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.foreground,
  },
  closeBtn: {
    backgroundColor: colors.muted,
    padding: spacing.sm,
    borderRadius: radius.pill,
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 11,
    color: colors.mutedForeground,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.primaryForeground,
    fontSize: 12,
    fontWeight: "bold",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  resetBtn: {
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  resetBtnText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  applyBtnText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: "600",
  },
});