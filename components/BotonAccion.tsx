import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { BORDES, SOMBRAS } from "../lib/constants/theme";

type Props = {
  texto: string;
  color: string;
  onPress: () => void;
};

export default function BotonAccion({ texto, color, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-6 py-3"
      style={{
        backgroundColor: color,
        borderRadius: BORDES.redondo,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <Text className="text-white font-bold text-lg">{texto}</Text>
    </TouchableOpacity>
  );
}
