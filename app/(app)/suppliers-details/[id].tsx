import AboutSection from "@/components/suppliers-details/AboutSection";
import ContactCard from "@/components/suppliers-details/ContactCard";
import CoverPhoto from "@/components/suppliers-details/CoverPhoto";
import FilesSection from "@/components/suppliers-details/FilesSection";
import GallerySection from "@/components/suppliers-details/GallerySection";
import InfoSection from "@/components/suppliers-details/InfoSection";
import SupplierHeader from "@/components/suppliers-details/SupplierHeader";
import { colors, radius } from "@/constants/theme";
import useCategories from "@/hooks/useCategories";
import useLabels from "@/hooks/useLabels";
import { useSupplierById } from "@/hooks/useSupplierById";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SupplierDetails() {
  const { id } = useLocalSearchParams();
  const { supplier, loading, error } = useSupplierById(String(id));
  const { labels } = useLabels();
  const { categories } = useCategories();

  if (loading) return <Text>Chargement en cours...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!supplier) return null;

  return (
    <ScrollView>
      <View style={styles.main}>
        <View>
          <CoverPhoto supplier={supplier} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <SupplierHeader
          supplier={supplier}
          labels={labels}
          categories={categories}
        />
        <AboutSection supplier={supplier} />
        <InfoSection supplier={supplier} />
        <GallerySection supplier={supplier} />
        <FilesSection supplier={supplier} />
        <ContactCard supplier={supplier} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingBottom: 96,
    backgroundColor: "#ffffff",
    flexDirection: "column",
    gap: 12,
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 16,
    backgroundColor: "white",
    padding: 8,
    borderRadius: radius.pill,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
