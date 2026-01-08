import React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import FotoBase from "./FotoBase";
import OverlayAcciones from "./OverlayAcciones";
import IndicadoresFlotantes from "./IndicadoresFlotantes";

interface SwipeableFotoProps {
  uri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeableFoto({ uri, onSwipeLeft, onSwipeRight }: SwipeableFotoProps) {
  // 1. Creamos el valor compartido AQUÍ
  const translateX = useSharedValue(0);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      {/* 2. Se lo pasamos a FotoBase para que lo controle el gesto */}
      <FotoBase 
        uri={uri} 
        onSwipeLeft={onSwipeLeft} 
        onSwipeRight={onSwipeRight} 
        translateX={translateX} 
      >
        {/* 3. Se lo pasamos a los overlays para que reaccionen al mismo valor */}
        <OverlayAcciones translateX={translateX} umbral={120} />
      </FotoBase>

      <IndicadoresFlotantes />
    </View>
  );
}