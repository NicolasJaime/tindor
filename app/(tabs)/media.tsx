import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useGaleria } from "@/lib/hooks/useGaleria";
import { LAYOUT } from "@/lib/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MediaScreen() {
  const {
    galeria,
    basura,
    cargando,
    recuperar,
    eliminarDefinitiva,
    vaciarBasura,
  } = useGaleria();

  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Animaciones modal
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const detailsTranslateY = useSharedValue(SCREEN_HEIGHT);

  const foto = galeria.find((f) => f.fuente === seleccionada);

  const cerrarModal = () => {
    setSeleccionada(null);
    setMostrarDetalles(false);
    translateY.value = 0;
    scale.value = 1;
    savedScale.value = 1;
    focalX.value = 0;
    focalY.value = 0;
    detailsTranslateY.value = SCREEN_HEIGHT;
  };

  // Gestos
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value <= 1.1 && event.translationY > 0) {
        translateY.value = event.translationY;
      } else if (scale.value > 1) {
        focalX.value = event.translationX;
        focalY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > 150 && scale.value <= 1.1) {
        runOnJS(cerrarModal)();
      } else {
        translateY.value = withSpring(0);
        focalX.value = withSpring(0);
        focalY.value = withSpring(0);
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 5));
      runOnJS(setMostrarDetalles)(false);
    })
    .onEnd(() => {
      if (scale.value < 1.1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        focalX.value = withSpring(0);
        focalY.value = withSpring(0);
      } else {
        savedScale.value = scale.value;
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        focalX.value = withSpring(0);
        focalY.value = withSpring(0);
      } else {
        scale.value = withSpring(2.5);
        savedScale.value = 2.5;
      }
    });

  const gestures = Gesture.Simultaneous(panGesture, pinchGesture, doubleTap);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: focalX.value },
      { translateY: focalY.value },
      { scale: scale.value },
    ],
    opacity: interpolate(translateY.value, [0, 300], [1, 0.5]),
  }));

  const detailsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: detailsTranslateY.value }],
  }));

  const eliminarFoto = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Eliminar", "¿Eliminar esta foto permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => eliminarDefinitiva(id),
      },
    ]);
  };

  const vaciar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Vaciar papelera", "¿Eliminar todas las fotos permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Vaciar", style: "destructive", onPress: () => vaciarBasura() },
    ]);
  };

  if (cargando) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950 justify-center items-center">
        <Text className="text-gray-400 text-xl font-semibold">Cargando fotos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="px-6 pt-6 pb-5 border-b border-gray-800/50 flex-row justify-between items-center">
        <Text className="text-white text-3xl font-black">Mis Fotos</Text>
        <TouchableOpacity
          onPress={vaciar}
          className="bg-rose-600 px-5 py-3 rounded-[20px]"
        >
          <Text className="text-white font-bold">Vaciar papelera</Text>
        </TouchableOpacity>
      </View>

      {/* Galería */}
      <FlatList
        data={galeria}
        keyExtractor={(item) => item.id}
        numColumns={LAYOUT.GALLERY_COLUMNS}
        contentContainerStyle={{ padding: LAYOUT.GALLERY_GAP }}
        columnWrapperStyle={{ gap: LAYOUT.GALLERY_GAP, marginBottom: LAYOUT.GALLERY_GAP }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 30).springify()}
            className="flex-1"
          >
            <TouchableOpacity
              onPress={() => setSeleccionada(item.fuente)}
              className="aspect-square"
            >
              <Image
                source={{ uri: item.fuente }}
                className="w-full h-full rounded-[20px] border border-gray-700"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      {/* Papelera */}
      <FlatList
        data={basura}
        keyExtractor={(item) => item.id}
        numColumns={LAYOUT.TRASH_COLUMNS}
        contentContainerStyle={{ padding: LAYOUT.TRASH_GAP }}
        columnWrapperStyle={{ gap: LAYOUT.TRASH_GAP, marginBottom: LAYOUT.TRASH_GAP }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 30).springify()}
            className="flex-1"
          >
            <View className="aspect-square rounded-[20px] overflow-hidden bg-gray-900 border border-gray-700 relative">
              <Image source={{ uri: item.fuente }} className="w-full h-full" />
              <View className="absolute inset-0 bg-black/40" />
              <View className="absolute bottom-2 left-2 right-2 flex-row gap-2">
                <TouchableOpacity
                  onPress={() => recuperar(item.id)}
                  className="flex-1 bg-emerald-600 py-2 rounded-[12px] items-center"
                >
                  <Ionicons name="arrow-undo" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => eliminarFoto(item.id)}
                  className="flex-1 bg-rose-600 py-2 rounded-[12px] items-center"
                >
                  <Ionicons name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
