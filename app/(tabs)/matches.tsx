import React from "react";
import { View, FlatList } from "react-native";
import CardPerfil from "../../components/CardPerfil";
import { usePerfiles } from "../../lib/hooks/usePerfiles";

export default function MatchesScreen() {
  const { perfiles } = usePerfiles();

  // Aquí podrías filtrar solo los que tienen "like" si tu backend lo guarda
  const matches = perfiles.filter(p => p.bio.includes("match"));

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardPerfil perfil={item} />}
      />
    </View>
  );
}
