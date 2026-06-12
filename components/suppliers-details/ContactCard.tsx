import { colors, radius, spacing } from "@/constants/theme";
import { supplierDetails } from "@/types/supplierDetails.type";
import { Globe } from "lucide-react-native";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Line, Path, Rect } from "react-native-svg";

type ContactCardProps = {
  supplier: supplierDetails;
};

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export default function ContactCard({ supplier }: ContactCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RETROUVEZ-NOUS</Text>

      {/* Site web */}
      {supplier.website && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(supplier.website!)}
        >
          <View style={styles.iconWrapper}>
            <Globe size={16} color={colors.foreground} />
          </View>
          <Text style={styles.link}>{truncate(supplier.website, 20)}</Text>
        </TouchableOpacity>
      )}

      {/* Facebook */}
      {supplier.facebook && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(supplier.facebook!)}
        >
          <View style={styles.iconWrapper}>
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill={colors.foreground}
            >
              <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </Svg>
          </View>
          <Text style={styles.link}>{truncate(supplier.facebook, 20)}</Text>
        </TouchableOpacity>
      )}

      {/* Instagram */}
      {supplier.instagram && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(supplier.instagram!)}
        >
          <View style={styles.iconWrapper}>
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.foreground}
              strokeWidth={2}
            >
              <Rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <Line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </Svg>
          </View>
          <Text style={styles.link}>{truncate(supplier.instagram, 20)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginLeft: 24,
    marginRight: 24,
  },
  title: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrapper: {
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
  },
  link: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
});
