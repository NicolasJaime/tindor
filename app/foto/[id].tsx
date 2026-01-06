import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useGaleria } from "@/lib/hooks/useGaleria";

export default function DetalleFoto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { galeria, basura, eliminarDefinitiva, recuperar, enviarABasura } = useGaleria();

  const todas = [...galeria, ...basura];
  const foto = todas.find((f) => f.id === id);

  // Zoom y pan básicos
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 4));
    })
    .onEnd(() => {
      if (scale.value < 1.1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translationX.value = event.translationX;
        translationY.value = event.translationY;
      }
    })
    .onEnd(() => {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      } else {
        scale.value = withSpring(2.5);
        savedScale.value = 2.5;
      }
    });

  const gestures = Gesture.Simultaneous(pinch, pan, doubleTap);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }));

  if (!foto) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center px-8">
        <Ionicons name="image-outline" size={100} color="#666" />
        <Text className="text-white text-2xl font-bold mt-6">Foto no encontrada</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-emerald-600 px-8 py-4 rounded-xl mt-6"
        >
          <Text className="text-white font-semibold">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const enBasura = basura.some((f) => f.id === id);
  const fecha = new Date(foto.fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const diasRestantes = enBasura
    ? Math.max(
        0,
        7 -
          Math.floor(
            (Date.now() - (foto.eliminadaEn || Date.now())) /
              (1000 * 60 * 60 * 24)
          )
      )
    : null;

  const borrar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      enBasura ? "Eliminar permanentemente" : "Mover a papelera",
      enBasura
        ? "Esta acción no se puede deshacer."
        : "La foto se moverá a papelera por 7 días.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: enBasura ? "Eliminar" : "Mover",
          style: "destructive",
          onPress: () => {
            if (enBasura) {
              eliminarDefinitiva(foto.id);
            } else {
              enviarABasura(foto.fuente, foto.ancho, foto.alto);
            }
            router.back();
          },
        },
      ]
    );
  };

  const recuperarFoto = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    recuperar(foto.id);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="px-6 pt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/10 p-3 rounded-full self-start"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Imagen con zoom */}
        <GestureDetector gesture={gestures}>
          <Animated.View
            style={[estiloAnimado, { alignItems: "center", justifyContent: "center", marginVertical: 20 }]}
          >
            <Image
              source={{ uri: foto.fuente }}
              className="w-[95%] h-[400px] rounded-2xl border border-gray-700"
              resizeMode="cover"
            />
          </Animated.View>
        </GestureDetector>

        {/* Detalles */}
        <View className="px-6">
          <Text className="text-white text-xl font-bold mb-4">Detalles</Text>
          <View className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-700">
            <Text className="text-gray-300 text-base mb-2">Fecha: {fecha}</Text>
            <Text className="text-gray-300 text-base">
              {enBasura ? "En papelera" : "En galería"}
            </Text>
            {enBasura && (
              <Text className="text-amber-400 text-base mt-2">
                {diasRestantes} día{diasRestantes !== 1 ? "s" : ""} restante
              </Text>
            )}
          </View>

          {/* Botones */}
          {enBasura ? (
            <>
              <TouchableOpacity
                onPress={recuperarFoto}
                className="bg-emerald-600 py-4 rounded-xl items-center mb-3"
              >
                <Text className="text-white font-bold">Recuperar a galería</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={borrar}
                className="bg-rose-600 py-4 rounded-xl items-center"
              >
                <Text className="text-white font-bold">Eliminar permanentemente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={borrar}
              className="bg-rose-600 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Mover a papelera</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
