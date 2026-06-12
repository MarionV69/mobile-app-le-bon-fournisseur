import { colors, radius } from "@/constants/theme";
import { supplierDetails } from "@/types/supplierDetails.type";
import { Image, StyleSheet, View } from "react-native";

type CoverPhotoProps = {
  supplier: supplierDetails;
};

export default function CoverPhoto({ supplier }: CoverPhotoProps) {
  return (
    <View style={styles.container}>
      {/* Image de couverture */}
      <Image
        source={{ uri: supplier.coverPhotoUrl }}
        style={styles.coverPhoto}
      />

      {/* Logo */}
      {supplier.logoUrl && (
        <View style={styles.logoContainer}>
          <Image source={{ uri: supplier.logoUrl }} style={styles.logo} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logoContainer: {
    position: "absolute",
    bottom: -32,
    left: 24,
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: radius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});