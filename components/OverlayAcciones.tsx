import React from "react";
import { View, Text } from "react-native";
import Animated, { useAnimatedStyle, interpolate, SharedValue } from "react-native-reanimated";

interface OverlayAccionesProps {
  translateX: SharedValue<number>;
  umbral: number;
}

export default function OverlayAcciones({ translateX, umbral }: OverlayAccionesProps) {
  const estiloLike = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, umbral], [0, 1], "clamp"),
  }));

  const estiloNope = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-umbral, 0], [1, 0], "clamp"),
  }));

  return (
    <>
      <Animated.View pointerEvents="none" className="absolute inset-0 justify-center items-center" style={estiloLike}>
        <View className="bg-emerald-500/30 absolute inset-0" />
        <Text className="text-6xl font-black text-emerald-400 border-4 border-emerald-400 p-2 rounded-xl rotate-[-10deg]">SAVE</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" className="absolute inset-0 justify-center items-center" style={estiloNope}>
        <View className="bg-rose-500/30 absolute inset-0" />
        <Text className="text-6xl font-black text-rose-400 border-4 border-rose-400 p-2 rounded-xl rotate-[10deg]">SKIP</Text>
      </Animated.View>
    </>
  );
}