import { colors, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import {
  isEmailValid,
  isNotEmptyString,
  validatePassword,
} from "@/utils/validation";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
};

export default function Register() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): RegisterErrors {
    const newErrors: RegisterErrors = {};

    if (!isNotEmptyString(formData.firstName))
      newErrors.firstName = "Le prénom est requis.";
    if (!isNotEmptyString(formData.lastName))
      newErrors.lastName = "Le nom est requis.";
    if (!isNotEmptyString(formData.email))
      newErrors.email = "L'email est requis.";
    else if (!isEmailValid(formData.email)) newErrors.email = "Email invalide.";
    if (!isNotEmptyString(formData.password)) {
      newErrors.password = "Le mot de passe est requis.";
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    }
    if (!isNotEmptyString(formData.confirmPassword)) {
      newErrors.confirmPassword = "La confirmation est requise.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Vous devez accepter les conditions.";

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
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "OWNER",
        acceptTerms: formData.acceptTerms,
      });
      router.replace("/(auth)/create-establishment");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setErrors({ email: "Cet email est déjà utilisé." });
      } else {
        setErrors({
          general: "Une erreur est survenue lors de l'inscription.",
        });
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
          <Text style={styles.title}>Créez un compte</Text>

          {errors.general && (
            <Text style={styles.errorGeneral}>{errors.general}</Text>
          )}

          {/* Firstname + Lastname */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "firstName" && styles.inputFocused,
                  !!errors.firstName && styles.inputError,
                ]}
                placeholder="Marie"
                placeholderTextColor={colors.mutedForeground}
                value={formData.firstName}
                onChangeText={(v) => handleChange("firstName", v)}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
                editable={!isLoading}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "lastName" && styles.inputFocused,
                  !!errors.lastName && styles.inputError,
                ]}
                placeholder="Dupont"
                placeholderTextColor={colors.mutedForeground}
                value={formData.lastName}
                onChangeText={(v) => handleChange("lastName", v)}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
                editable={!isLoading}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
                !!errors.email && styles.inputError,
              ]}
              placeholder="vous@exemple.fr"
              placeholderTextColor={colors.mutedForeground}
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  focusedField === "password" && styles.inputFocused,
                  !!errors.password && styles.inputError,
                ]}
                placeholder="••••••••••••"
                placeholderTextColor={colors.mutedForeground}
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
                accessibilityLabel={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? (
                  <EyeOff
                    width={18}
                    height={18}
                    color={colors.mutedForeground}
                  />
                ) : (
                  <Eye width={18} height={18} color={colors.mutedForeground} />
                )}
              </Pressable>
            </View>
            <Text style={styles.hint}>
              Minimum 12 caractères dont 1 majuscule, 1 chiffre et 1 caractère
              spécial
            </Text>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  focusedField === "confirmPassword" && styles.inputFocused,
                  !!errors.confirmPassword && styles.inputError,
                ]}
                placeholder="••••••••••••"
                placeholderTextColor={colors.mutedForeground}
                value={formData.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword((v) => !v)}
                accessibilityLabel={
                  showConfirmPassword ? "Masquer" : "Afficher"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff
                    width={18}
                    height={18}
                    color={colors.mutedForeground}
                  />
                ) : (
                  <Eye width={18} height={18} color={colors.mutedForeground} />
                )}
              </Pressable>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* CGU */}
          <View style={styles.termsRow}>
            <Switch
              value={formData.acceptTerms}
              onValueChange={(v) => {
                setFormData((prev) => ({ ...prev, acceptTerms: v }));
                if (errors.acceptTerms)
                  setErrors((prev) => ({ ...prev, acceptTerms: undefined }));
              }}
              trackColor={{
                false: colors.inputBorder,
                true: colors.primary,
              }}
              thumbColor={colors.background}
              disabled={isLoading}
            />
            <Text style={styles.termsText}>
              {"J'accepte les "}
              <Text style={styles.termsLink}>conditions générales</Text>
              {" et la "}
              <Text style={styles.termsLink}>politique de confidentialité</Text>
            </Text>
          </View>
          {errors.acceptTerms && (
            <Text style={styles.errorText}>{errors.acceptTerms}</Text>
          )}

          {/* Submit */}
          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>Continuer</Text>
            )}
          </Pressable>

          {/* Login link */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Déjà membre ?</Text>
            <View style={styles.separatorLine} />
          </View>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.link}>Connexion</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.foreground,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
    gap: spacing.xs,
  },
  fieldGroup: {
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
  inputWithIcon: {
    paddingRight: 44,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  inputWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: spacing.sm,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
  hint: {
    fontSize: 12,
    color: colors.mutedForeground,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: colors.mutedForeground,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 10,
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
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  link: {
    textAlign: "center",
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginTop: -spacing.md,
  },
});
