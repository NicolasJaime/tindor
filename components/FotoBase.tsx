import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const UMBRAL_SWIPE = SCREEN_WIDTH * 0.3;

interface FotoBaseProps {
  uri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children?: React.ReactNode; // overlays o info extra
}

export default function FotoBase({ uri, onSwipeLeft, onSwipeRight, children }: FotoBaseProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5;
    })
    .onEnd((event) => {
      const absX = Math.abs(event.translationX);
      if (absX > UMBRAL_SWIPE) {
        const direction = event.translationX > 0 ? 1 : -1;
        Haptics.notificationAsync(
          direction > 0
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning
        );
        translateX.value = withTiming(direction * (SCREEN_WIDTH + 100), { duration: 300 });
        runOnJS(direction > 0 ? onSwipeRight : onSwipeLeft)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const estiloTarjeta = useAnimatedStyle(() => {
    const rotacion = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-12, 0, 12]
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotacion}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        className="w-[94%] h-[78%] rounded-[32px] overflow-hidden shadow-2xl"
        style={estiloTarjeta}
      >
        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
