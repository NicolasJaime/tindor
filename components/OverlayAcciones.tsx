import React from "react";
import { View, Text } from "react-native";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";

interface OverlayAccionesProps {
  translateX: Animated.SharedValue<number>;
  umbral: number;
}

export default function OverlayAcciones({ translateX, umbral }: OverlayAccionesProps) {
  const estiloLike = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, umbral], [0, 1]),
  }));

  const estiloNope = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-umbral, 0], [1, 0]),
  }));

  return (
    <>
      <Animated.View className="absolute inset-0 justify-center items-center" style={estiloLike}>
        <View className="bg-emerald-500/30 absolute inset-0" />
        <Text className="text-5xl font-black text-emerald-400">SAVE</Text>
      </Animated.View>

      <Animated.View className="absolute inset-0 justify-center items-center" style={estiloNope}>
        <View className="bg-rose-500/30 absolute inset-0" />
        <Text className="text-5xl font-black text-rose-400">SKIP</Text>
      </Animated.View>
    </>
  );
}
