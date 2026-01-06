import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Perfil } from "../types/perfil";

const PERFILES_KEY = "@tinder_app:perfiles";

export function usePerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    try {
      setCargando(true);
      const perfilesJson = await AsyncStorage.getItem(PERFILES_KEY);
      if (perfilesJson) {
        setPerfiles(JSON.parse(perfilesJson));
      } else {
        await inicializarPerfiles(); // si no hay nada, inicializa
      }
    } catch (error) {
      console.error("❌ Error cargando perfiles:", error);
    } finally {
      setCargando(false);
    }
  };

  const guardarPerfiles = async (nuevos: Perfil[]) => {
    try {
      await AsyncStorage.setItem(PERFILES_KEY, JSON.stringify(nuevos));
      setPerfiles(nuevos);
    } catch (error) {
      console.error("❌ Error guardando perfiles:", error);
    }
  };

  const darLike = async (id: string) => {
    const restantes = perfiles.filter(p => p.id !== id);
    await guardarPerfiles(restantes);
  };

  const rechazar = async (id: string) => {
    const restantes = perfiles.filter(p => p.id !== id);
    await guardarPerfiles(restantes);
  };

  const inicializarPerfiles = async () => {
    const iniciales: Perfil[] = [
      { id: "1", nombre: "Ana", edad: 24, foto: "https://randomuser.me/api/portraits/women/44.jpg", bio: "Me encanta viajar y los perros 🐶" },
      { id: "2", nombre: "Carlos", edad: 28, foto: "https://randomuser.me/api/portraits/men/32.jpg", bio: "Fan del cine y la música 🎬🎶" },
      { id: "3", nombre: "Lucía", edad: 22, foto: "https://randomuser.me/api/portraits/women/65.jpg", bio: "Amante del café y los libros ☕📚" }
    ];
    await guardarPerfiles(iniciales);
  };

  return { perfiles, cargando, cargarPerfiles, darLike, rechazar };
}
