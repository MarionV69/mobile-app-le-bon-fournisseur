import { sendMessage } from "@/api/conversations";
import { UPLOAD_CONFIG } from "@/config/upload.config";
import { colors, radius, spacing } from "@/constants/theme";
import type { Message } from "@/types/conversations.types";
import * as ImagePicker from "expo-image-picker";
import { Camera, Send, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type MessageInputProps = {
  conversationId: number;
  onMessageSent: (message: Message) => void;
};

export default function MessageInput({
  conversationId,
  onMessageSent,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingPhoto, setPendingPhoto] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  function handleAddPhoto() {
    Alert.alert("Ajouter une photo", "Choisissez une source", [
      { text: "Prendre une photo", onPress: handleTakePhoto },
      { text: "Choisir dans la galerie", onPress: handlePickFromGallery },
      { text: "Annuler", style: "cancel" },
    ]);
  }

  function checkFileSize(asset: ImagePicker.ImagePickerAsset): boolean {
    if (asset.fileSize && asset.fileSize > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      Alert.alert(
        "Fichier trop volumineux",
        `La photo ne doit pas dépasser ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024} Mo`,
      );
      return false;
    }
    return true;
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission requise",
        "L'accès à l'appareil photo est nécessaire pour prendre une photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!checkFileSize(asset)) return;

    setPendingPhoto(asset);
  }

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission requise",
        "L'accès à la galerie est nécessaire pour choisir une photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!checkFileSize(asset)) return;

    setPendingPhoto(asset);
  }

  async function handleSubmit() {
    if (!content.trim() && !pendingPhoto) {
      Alert.alert("Message vide", "Le message ne peut pas être vide.");
      return;
    }

    setSending(true);
    try {
      const message = await sendMessage(conversationId, {
        content,
        attachment: pendingPhoto ?? undefined,
      });

      onMessageSent(message);
      setContent("");
      setPendingPhoto(null);
    } catch (err) {
      console.error("Error sending message:", err);
      Alert.alert("Erreur", "Erreur lors de l'envoi du message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Pending photo preview */}
      {pendingPhoto && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: pendingPhoto.uri }}
            style={styles.previewImage}
          />
          <Pressable
            style={styles.removePhotoButton}
            onPress={() => setPendingPhoto(null)}
          >
            <X width={14} height={14} color="#ffffff" />
          </Pressable>
        </View>
      )}

      <View style={styles.row}>
        {/* Camera/gallery button */}
        <Pressable
          style={styles.cameraButton}
          onPress={handleAddPhoto}
          disabled={sending || !!pendingPhoto}
        >
          <Camera
            width={20}
            height={20}
            color={pendingPhoto ? colors.border : colors.mutedForeground}
          />
        </Pressable>

        {/* Text input */}
        <TextInput
          style={styles.input}
          placeholder="Écrire un message"
          placeholderTextColor={colors.mutedForeground}
          value={content}
          onChangeText={setContent}
          editable={!sending}
          multiline
        />

        {/* Send button */}
        <Pressable
          style={[
            styles.sendButton,
            (sending || (!content.trim() && !pendingPhoto)) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={sending || (!content.trim() && !pendingPhoto)}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Send width={18} height={18} color={colors.primaryForeground} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  previewContainer: {
    position: "relative",
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  removePhotoButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cameraButton: {
    padding: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.foreground,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
