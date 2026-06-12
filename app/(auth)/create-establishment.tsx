import { createEstablishment } from "@/api/establishments";
import { colors, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { EstablishmentType } from "@/types/establishments.types";
import {
  isNotEmptyString,
  isPhoneValid,
  isPostalCodeValid,
  isSiretValid,
} from "@/utils/validation";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type CreateEstablishmentErrors = {
  legalName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  siret?: string;
  phone?: string;
  general?: string;
};

export default function CreateEstablishment() {
  const { refreshUser } = useAuth();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CreateEstablishmentErrors>({});

  const [formData, setFormData] = useState({
    legalName: "",
    address: "",
    postalCode: "",
    city: "",
    country: "France",
    siret: "",
    phone: "",
  });

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CreateEstablishmentErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): CreateEstablishmentErrors {
    const newErrors: CreateEstablishmentErrors = {};

    if (!isNotEmptyString(formData.legalName))
      newErrors.legalName = "La raison sociale est requise.";
    if (!isNotEmptyString(formData.address))
      newErrors.address = "L'adresse est requise.";
    if (!isNotEmptyString(formData.postalCode)) {
      newErrors.postalCode = "Le code postal est requis.";
    } else if (!isPostalCodeValid(formData.postalCode)) {
      newErrors.postalCode = "Le code postal doit contenir 5 chiffres.";
    }
    if (!isNotEmptyString(formData.city))
      newErrors.city = "La ville est requise.";
    if (!isNotEmptyString(formData.siret)) {
      newErrors.siret = "Le SIRET est requis.";
    } else if (!isSiretValid(formData.siret)) {
      newErrors.siret = "Le SIRET doit contenir 14 chiffres.";
    }
    if (formData.phone && !isPhoneValid(formData.phone)) {
      newErrors.phone = "Format invalide. Ex : 06 12 34 56 78";
    }

    return newErrors;
  }

  async function handleSubmit() {
    setErrors({});
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await createEstablishment({
        type: EstablishmentType.RESTAURANT,
        legalName: formData.legalName,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
        siret: formData.siret.replace(/\s/g, ""),
        phone: formData.phone || undefined,
      });
      await refreshUser();
      router.replace("/confirmation");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setErrors({ siret: "Ce SIRET est déjà utilisé." });
      } else {
        setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Votre établissement</Text>
            <Text style={styles.subtitle}>
              Complétez votre profil pour accéder à la plateforme.
            </Text>
          </View>

          {errors.general && (
            <Text style={styles.errorGeneral}>{errors.general}</Text>
          )}

          {/* Raison sociale */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Raison sociale *</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "legalName" && styles.inputFocused,
                !!errors.legalName && styles.inputError,
              ]}
              placeholder="Le Bouchon Lyonnais"
              placeholderTextColor={colors.mutedForeground}
              value={formData.legalName}
              onChangeText={(v) => handleChange("legalName", v)}
              onFocus={() => setFocusedField("legalName")}
              onBlur={() => setFocusedField(null)}
              editable={!isLoading}
            />
            {errors.legalName && (
              <Text style={styles.errorText}>{errors.legalName}</Text>
            )}
          </View>

          {/* Adresse */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "address" && styles.inputFocused,
                !!errors.address && styles.inputError,
              ]}
              placeholder="12 rue de la République"
              placeholderTextColor={colors.mutedForeground}
              value={formData.address}
              onChangeText={(v) => handleChange("address", v)}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              editable={!isLoading}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>

          {/* Code postal + Ville */}
          <View style={styles.row}>
            <View style={styles.smallField}>
              <Text style={styles.label}>Code postal *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "postalCode" && styles.inputFocused,
                  !!errors.postalCode && styles.inputError,
                ]}
                placeholder="69001"
                placeholderTextColor={colors.mutedForeground}
                value={formData.postalCode}
                onChangeText={(v) => handleChange("postalCode", v)}
                onFocus={() => setFocusedField("postalCode")}
                onBlur={() => setFocusedField(null)}
                keyboardType="numeric"
                editable={!isLoading}
              />
              {errors.postalCode && (
                <Text style={styles.errorText}>{errors.postalCode}</Text>
              )}
            </View>
            <View style={styles.largeField}>
              <Text style={styles.label}>Ville *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "city" && styles.inputFocused,
                  !!errors.city && styles.inputError,
                ]}
                placeholder="Lyon"
                placeholderTextColor={colors.mutedForeground}
                value={formData.city}
                onChangeText={(v) => handleChange("city", v)}
                onFocus={() => setFocusedField("city")}
                onBlur={() => setFocusedField(null)}
                editable={!isLoading}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>
          </View>

          {/* SIRET + Téléphone */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>SIRET *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "siret" && styles.inputFocused,
                  !!errors.siret && styles.inputError,
                ]}
                placeholder="123 456 789 00012"
                placeholderTextColor={colors.mutedForeground}
                value={formData.siret}
                onChangeText={(v) => handleChange("siret", v)}
                onFocus={() => setFocusedField("siret")}
                onBlur={() => setFocusedField(null)}
                keyboardType="numeric"
                editable={!isLoading}
              />
              {errors.siret && (
                <Text style={styles.errorText}>{errors.siret}</Text>
              )}
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "phone" && styles.inputFocused,
                  !!errors.phone && styles.inputError,
                ]}
                placeholder="06 12 34 56 78"
                placeholderTextColor={colors.mutedForeground}
                value={formData.phone}
                onChangeText={(v) => handleChange("phone", v)}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
          </View>

          {/* Submit */}
          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>Créer mon compte</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
    gap: spacing.xs,
  },
  smallField: {
    flex: 2,
    gap: spacing.xs,
  },
  largeField: {
    flex: 3,
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.foreground,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
  },
  errorGeneral: {
    fontSize: 14,
    color: colors.destructive,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 10,
    marginTop: spacing.sm,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontWeight: "600",
    fontSize: 15,
  },
});
