import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function IndicadoresFlotantes() {
  return (
    <View className="absolute bottom-16 left-0 right-0 flex-row justify-between px-16">
      <View className="items-center">
        <View className="bg-gradient-to-br from-rose-500 to-rose-600 p-5 rounded-[24px] shadow-2xl shadow-rose-500/50">
          <Ionicons name="close" size={36} color="white" />
        </View>
        <Text className="text-white text-sm mt-3 font-black">PAPELERA</Text>
      </View>

      <View className="items-center">
        <View className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-[24px] shadow-2xl shadow-emerald-500/50">
          <Ionicons name="heart" size={36} color="white" />
        </View>
        <Text className="text-white text-sm mt-3 font-black">GALERÍA</Text>
      </View>
    </View>
  );
}
