import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Imagen, EstadisticasImagenes, LIMITE_GALERIA, LIMITE_BASURA, DIAS_AUTO_BORRADO } from "../types/media";

const MEDIA_KEY = "@tinder_app:imagenes";
const STATS_KEY = "@tinder_app:estadisticas";
const MEDIA_DIR = `${FileSystem.documentDirectory}imagenes/`;

export function useMedia() {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [stats, setStats] = useState<EstadisticasImagenes>({
    tomadas: 0,
    guardadas: 0,
    eliminadas: 0,
    enGaleria: 0,
    enBasura: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
      }
      await cargarImagenes();
      await cargarStats();
    } catch (error) {
      console.error("❌ [MEDIA] Error inicializando:", error);
    }
  };

  const cargarImagenes = async () => {
    try {
      setCargando(true);
      const data = await AsyncStorage.getItem(MEDIA_KEY);
      const lista: Imagen[] = data ? JSON.parse(data) : [];
      await limpiarBasuraAntigua(lista);
      setImagenes(lista);
    } catch (error) {
      console.error("❌ [MEDIA] Error cargando imágenes:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarStats = async () => {
    try {
      const data = await AsyncStorage.getItem(STATS_KEY);
      const base: EstadisticasImagenes = data
        ? JSON.parse(data)
        : { tomadas: 0, guardadas: 0, eliminadas: 0, enGaleria: 0, enBasura: 0 };

      base.enGaleria = imagenes.filter(i => !i.enBasura).length;
      base.enBasura = imagenes.filter(i => i.enBasura).length;
      setStats(base);
    } catch (error) {
      console.error("❌ [MEDIA] Error cargando estadísticas:", error);
    }
  };

  const guardarEnGaleria = async (uri: string, ancho: number, alto: number) => {
    const enGaleria = imagenes.filter(i => !i.enBasura);
    if (enGaleria.length >= LIMITE_GALERIA) return null;

    const id = Date.now().toString();
    const destino = `${MEDIA_DIR}${id}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: destino });

    const nueva: Imagen = {
      id,
      fuente: destino,
      fecha: Date.now(),
      ancho,
      alto,
      enBasura: false,
    };

    const actualizadas = [...imagenes, nueva];
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(actualizadas));
    setImagenes(actualizadas);

    const nuevasStats = { ...stats, tomadas: stats.tomadas + 1, guardadas: stats.guardadas + 1 };
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(nuevasStats));
    setStats(nuevasStats);

    return nueva;
  };

  const moverABasura = async (id: string) => {
    const actualizadas = imagenes.map(i =>
      i.id === id ? { ...i, enBasura: true, eliminadaEn: Date.now() } : i
    );
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(actualizadas));
    setImagenes(actualizadas);

    const nuevasStats = { ...stats, tomadas: stats.tomadas + 1, eliminadas: stats.eliminadas + 1 };
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(nuevasStats));
    setStats(nuevasStats);
  };

  const recuperar = async (id: string) => {
    const actualizadas = imagenes.map(i =>
      i.id === id ? { ...i, enBasura: false, eliminadaEn: undefined } : i
    );
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(actualizadas));
    setImagenes(actualizadas);
  };

  const eliminarDefinitiva = async (id: string) => {
    const imagen = imagenes.find(i => i.id === id);
    if (imagen) {
      await FileSystem.deleteAsync(imagen.fuente);
    }
    const filtradas = imagenes.filter(i => i.id !== id);
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(filtradas));
    setImagenes(filtradas);
  };

  const limpiarBasuraAntigua = async (lista: Imagen[]) => {
    const ahora = Date.now();
    const limite = ahora - DIAS_AUTO_BORRADO * 24 * 60 * 60 * 1000;
    const porEliminar = lista.filter(i => i.enBasura && i.eliminadaEn && i.eliminadaEn < limite);
    for (const img of porEliminar) {
      await eliminarDefinitiva(img.id);
    }
  };

  return {
    imagenes,
    stats,
    cargando,
    cargarImagenes,
    guardarEnGaleria,
    moverABasura,
    recuperar,
    eliminarDefinitiva,
  };
}
