import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useGaleria } from "@/lib/hooks/useGaleria";
import { LAYOUT } from "@/lib/constants/theme";

export default function MediaScreen() {
  const {
    galeria,
    basura,
    cargando,
    recuperar,
    eliminarDefinitiva,
    vaciarBasura,
  } = useGaleria();

  // Función para manejar la eliminación con alerta
  const confirmarEliminar = (id: string) => {
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

  if (cargando) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950 justify-center items-center">
        <Text className="text-gray-400 text-xl font-semibold">Cargando fotos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header unificado */}
      <View className="px-6 pt-6 pb-5 border-b border-gray-800/50 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-3xl font-black">Media</Text>
          <Text className="text-gray-500 text-sm">{galeria.length + basura.length} elementos en total</Text>
        </View>
        {basura.length > 0 && (
          <TouchableOpacity
            onPress={() => vaciarBasura()}
            className="bg-rose-600/20 px-4 py-2 rounded-full border border-rose-600/50"
          >
            <Text className="text-rose-400 font-bold text-xs">VACIAR PAPELERA</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista Única con Secciones */}
      <FlatList
        data={[{ type: 'galeria', data: galeria }, { type: 'basura', data: basura }]}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => (
          <View>
            {/* Título de sección */}
            <View className="px-6 py-4 bg-gray-900/30">
              <Text className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                {item.type === 'galeria' ? `Galería (${item.data.length})` : `Papelera (${item.data.length})`}
              </Text>
            </View>

            {/* Grid de fotos */}
            <View className="flex-row flex-wrap px-2">
              {item.data.length === 0 ? (
                <Text className="text-gray-600 italic p-4">No hay fotos aquí</Text>
              ) : (
                item.data.map((foto, index) => (
                  <Animated.View
                    key={foto.id}
                    entering={FadeInDown.delay(index * 50).springify()}
                    style={{ width: '33.33%', padding: 4 }}
                  >
                    <View className="aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                      <Image source={{ uri: foto.fuente }} className="w-full h-full" />
                      
                      {/* Controles si está en papelera */}
                      {item.type === 'basura' && (
                        <View className="absolute inset-0 bg-black/50 justify-center items-center flex-row gap-2">
                          <TouchableOpacity 
                            onPress={() => recuperar(foto.id)}
                            className="bg-emerald-500 p-2 rounded-full"
                          >
                            <Ionicons name="refresh" size={18} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => confirmarEliminar(foto.id)}
                            className="bg-rose-500 p-2 rounded-full"
                          >
                            <Ionicons name="trash" size={18} color="white" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                ))
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}