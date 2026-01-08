import React from "react";
import { Image, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
// ✅ IMPORTACIÓN CRÍTICA: Asegúrate de que sea exactamente desde 'react-native-reanimated'
import Animated, {
  useAnimatedStyle,
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const UMBRAL_SWIPE = SCREEN_WIDTH * 0.3;

interface FotoBaseProps {
  uri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  translateX: SharedValue<number>; 
  children?: React.ReactNode;
}

export default function FotoBase({ uri, onSwipeLeft, onSwipeRight, translateX, children }: FotoBaseProps) {
  // ✅ REGLA DE HOOKS: Esta línea DEBE ir al inicio del componente, 
  // antes de cualquier 'if' o 'return' temprano.
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

        // ✅ CORRECCIÓN: Haptics debe ejecutarse mediante runOnJS
        runOnJS(Haptics.notificationAsync)(
          direction > 0
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning
        );

        // Animación de salida
        translateX.value = withTiming(
          direction * (SCREEN_WIDTH + 100), 
          { duration: 300 },
          (isFinished) => {
            if (isFinished) {
              runOnJS(direction > 0 ? onSwipeRight : onSwipeLeft)();
            }
          }
        );
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
        style={estiloTarjeta}
        className="w-[94%] h-[78%] rounded-[32px] overflow-hidden shadow-2xl bg-zinc-900"
      >
        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
        {children}
      </Animated.View>
    </GestureDetector>
  );
}