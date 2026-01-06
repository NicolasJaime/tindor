import { Redirect } from "expo-router";

export default function InicioTabs() {
  // Redirige automáticamente a la cámara
  return <Redirect href="/(tabs)/camara" />;
}
