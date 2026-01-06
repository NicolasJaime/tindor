import React from "react";
import { View, Text } from "react-native";
import { TIPOGRAFIA } from "../lib/constants/theme";

type Props = {
  titulo: string;
};

export default function Header({ titulo }: Props) {
  return (
    <View className="w-full p-4 bg-cafe">
      <Text className={`${TIPOGRAFIA.titulo} text-white`}>{titulo}</Text>
    </View>
  );
}
