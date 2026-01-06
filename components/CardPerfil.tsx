import React from "react";
import { View, Text, Image } from "react-native";
import { Perfil } from "../lib/types/perfil";
import { BORDES, SOMBRAS } from "../lib/constants/theme";

type Props = {
  perfil: Perfil;
};

export default function CardPerfil({ perfil }: Props) {
  return (
    <View
      className="bg-white p-4"
      style={{
        borderRadius: BORDES.tarjeta,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <Image
        source={{ uri: perfil.foto }}
        className="w-full h-72 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-xl font-bold mt-2">
        {perfil.nombre}, {perfil.edad}
      </Text>
      <Text className="text-gray-600">{perfil.bio}</Text>
    </View>
  );
}
