import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useGaleria } from "@/lib/hooks/useGaleria";
import SwipeableFoto from "@/components/SwipeableFoto";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function CamaraScreen() {
  const { galeriaLlena, guardarEnGaleria, enviarABasura, galeria } = useGaleria();
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [dimensiones, setDimensiones] = useState({ ancho: 0, alto: 0 });
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const camaraRef = useRef<CameraView>(null);

  if (!permiso) return <Text>Verificando permisos...</Text>;
  if (!permiso.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center px-8">
        <Ionicons name="camera-outline" size={120} color="#10b981" />
        <Text className="text-white text-2xl font-bold mt-6 text-center">
          Se requiere acceso a la cámara
        </Text>
        <TouchableOpacity
          onPress={pedirPermiso}
          className="bg-emerald-600 px-10 py-5 rounded-2xl mt-8"
        >
          <Text className="text-white text-lg font-bold">Conceder permiso</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const tomarFoto = async () => {
    if (galeriaLlena) {
      Alert.alert("Galería llena", "El límite de 15 fotos ha sido alcanzado.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const foto = await camaraRef.current?.takePictureAsync({ quality: 0.9 });

    if (foto) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFotoUri(foto.uri);
      setDimensiones({ ancho: foto.width, alto: foto.height });
    }
  };

  const swipeIzquierda = () => {
    if (fotoUri) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      enviarABasura(fotoUri, dimensiones.ancho, dimensiones.alto);
    }
    setFotoUri(null);
  };

  const swipeDerecha = () => {
    if (fotoUri) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      guardarEnGaleria(fotoUri, dimensiones.ancho, dimensiones.alto);
    }
    setFotoUri(null);
  };

  const cambiarCamara = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(facing === "back" ? "front" : "back");
  };

  const alternarFlash = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlash(flash === "off" ? "on" : flash === "on" ? "auto" : "off");
  };

  const iconoFlash = flash === "off" ? "flash-off" : flash === "on" ? "flash" : "flash-outline";
  const progreso = (galeria.length / 15) * 100;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {fotoUri ? (
        <SwipeableFoto uri={fotoUri} onSwipeLeft={swipeIzquierda} onSwipeRight={swipeDerecha} />
      ) : (
        <>
          <CameraView ref={camaraRef} style={{ flex: 1 }} facing={facing} flash={flash} />

          {/* Controles superiores */}
          <View className="absolute top-0 left-0 right-0 pt-14 pb-6 px-6 bg-black/60">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={alternarFlash} className="p-3.5 rounded-full bg-white/20">
                <Ionicons name={iconoFlash} size={24} color="white" />
              </TouchableOpacity>

              <View className="px-5 py-2.5 rounded-full bg-white/20">
                <Text className="text-white text-base font-bold">{galeria.length}/15</Text>
              </View>

              <TouchableOpacity onPress={cambiarCamara} className="p-3.5 rounded-full bg-white/20">
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Barra de progreso */}
            <View className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <View
                className={`h-full rounded-full ${progreso >= 80 ? "bg-rose-500" : "bg-emerald-500"}`}
                style={{ width: `${progreso}%` }}
              />
            </View>
          </View>

          {/* Botón de captura */}
          <View className="absolute bottom-0 left-0 right-0 pb-10 pt-6 px-6 bg-black/60 items-center">
            <TouchableOpacity
              onPress={tomarFoto}
              disabled={galeriaLlena}
              className={`w-24 h-24 rounded-full bg-white justify-center items-center shadow-2xl ${
                galeriaLlena ? "opacity-30" : ""
              }`}
            >
              <View className="w-20 h-20 rounded-full border-4 border-black" />
            </TouchableOpacity>

            {galeriaLlena && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <Text className="text-rose-400 mt-3 text-sm font-semibold">
                  Galería llena - Libera espacio
                </Text>
              </Animated.View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
