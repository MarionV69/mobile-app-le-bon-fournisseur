import api from "@/api/axiosConfig";
import { Button, View } from "react-native";

export default function Index() {
  async function testApi() {
    try {
      const res = await api.get("/suppliers");
      console.log("Succès", res.data);
    } catch (e) {
      console.error("Erreur", e);
    }
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Test API" onPress={testApi} />
    </View>
  );
}
