import { colors, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email invalide.";
    if (!password) newErrors.password = "Le mot de passe est requis.";
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
      const user = await login(email, password);
      if (!user.establishmentId) {
        router.replace("/(auth)/create-establishment");
      } else {
        router.replace("/(app)/suppliers");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setErrors({ general: "Email ou mot de passe incorrect." });
      } else {
        setErrors({ general: "Une erreur est survenue lors de la connexion." });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {errors.general && (
        <Text style={styles.errorGeneral}>{errors.general}</Text>
      )}

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
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={!showPassword}
            autoComplete="password"
            editable={!isLoading}
          />
          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword((v) => !v)}
            accessibilityLabel={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <EyeOff width={18} height={18} color={colors.mutedForeground} />
            ) : (
              <Eye width={18} height={18} color={colors.mutedForeground} />
            )}
          </Pressable>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
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
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </Pressable>

      {/* Register link */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>
          Nouveau sur le bon fournisseur ?
        </Text>
        <View style={styles.separatorLine} />
      </View>
      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>Créer un compte</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.foreground,
  },
  fieldGroup: {
    gap: spacing.sm,
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
    borderColor: colors.primaryMid,
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
    marginVertical: spacing.sm,
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
