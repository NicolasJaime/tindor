import React from "react";
import { View } from "react-native";
import FotoBase from "./FotoBase";
import OverlayAcciones from "./OverlayAcciones";
import IndicadoresFlotantes from "./IndicadoresFlotantes";
import Animated, { useSharedValue } from "react-native-reanimated";

const UMBRAL_SWIPE = 120; // puedes ajustar el umbral

interface SwipeableFotoProps {
  uri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeableFoto({ uri, onSwipeLeft, onSwipeRight }: SwipeableFotoProps) {
  // valores compartidos para animaciones
  const translateX = useSharedValue(0);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      {/* Foto con gestos */}
      <FotoBase uri={uri} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        {/* Overlays de acciones */}
        <OverlayAcciones translateX={translateX} umbral={UMBRAL_SWIPE} />
      </FotoBase>

      {/* Indicadores flotantes */}
      <IndicadoresFlotantes />
    </View>
  );
}
