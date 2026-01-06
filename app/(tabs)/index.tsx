import React from "react";
import { View } from "react-native";
import { usePerfiles } from "../../lib/hooks/usePerfiles";
import CardPerfil from "../../components/CardPerfil";
import BotonAccion from "../../components/BotonAccion";
import Loader from "../../components/Loader";

export default function HomeScreen() {
  const { perfiles, cargando, darLike, rechazar } = usePerfiles();

  if (cargando) return <Loader />;

  const perfilActual = perfiles[0];

  if (!perfilActual) {
    return (
      <View className="flex-1 items-center justify-center">
        <CardPerfil
          perfil={{
            id: "0",
            nombre: "No hay más perfiles",
            edad: 0,
            foto: "https://via.placeholder.com/300",
            bio: "Intenta más tarde",
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <CardPerfil perfil={perfilActual} />
      <View className="flex-row gap-4 mt-4">
        <BotonAccion texto="❌ Rechazar" color="#be123c" onPress={() => rechazar(perfilActual.id)} />
        <BotonAccion texto="❤️ Like" color="#10b981" onPress={() => darLike(perfilActual.id)} />
      </View>
    </View>
  );
}
