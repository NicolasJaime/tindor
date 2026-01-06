import React from "react";
import { View, Text, Button } from "react-native";
import { useAutenticacion } from "../../lib/hooks/useAutenticacion";
import { useTema } from "../../lib/hooks/useTema";

export default function PerfilScreen() {
  const { usuario, login, logout } = useAutenticacion();
  const { temaOscuro, alternarTema } = useTema();

  return (
    <View className="flex-1 items-center justify-center gap-4">
      {usuario ? (
        <>
          <Text className="text-xl font-bold">Hola, {usuario.nombre}</Text>
          <Button title="Cerrar sesión" onPress={logout} />
        </>
      ) : (
        <Button title="Iniciar sesión" onPress={() => login("Jaime", "jaime@email.com")} />
      )}
      <Button
        title={temaOscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
        onPress={alternarTema}
      />
    </View>
  );
}
