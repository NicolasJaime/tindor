import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

export default function Loader() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#6f4e37" />
      <Text className="mt-2 text-gray-600">Cargando...</Text>
    </View>
  );
}
