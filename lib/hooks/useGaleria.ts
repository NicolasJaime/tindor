import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import {
  Imagen,
  EstadisticasImagenes,
  LIMITE_GALERIA,
  LIMITE_BASURA,
  DIAS_AUTO_BORRADO,
} from "../types/media";

const MEDIA_KEY = "@tinder_app:imagenes";
const STATS_KEY = "@tinder_app:estadisticas";
const MEDIA_DIR = `${FileSystem.documentDirectory}imagenes/`;

export function useGaleria() {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [galeria, setGaleria] = useState<Imagen[]>([]);
  const [basura, setBasura] = useState<Imagen[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasImagenes>({
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
      await recargar();
    } catch (error) {
      console.error("❌ [MEDIA] Error inicializando:", error);
    }
  };

  const recargar = async () => {
    try {
      setCargando(true);
      const data = await AsyncStorage.getItem(MEDIA_KEY);
      const lista: Imagen[] = data ? JSON.parse(data) : [];
      await limpiarBasuraAntigua(lista);

      setImagenes(lista);
      setGaleria(lista.filter(i => !i.enBasura));
      setBasura(lista.filter(i => i.enBasura));

      const statsData = await AsyncStorage.getItem(STATS_KEY);
      const base: EstadisticasImagenes = statsData
        ? JSON.parse(statsData)
        : { tomadas: 0, guardadas: 0, eliminadas: 0, enGaleria: 0, enBasura: 0 };

      base.enGaleria = lista.filter(i => !i.enBasura).length;
      base.enBasura = lista.filter(i => i.enBasura).length;
      setEstadisticas(base);
    } catch (error) {
      console.error("❌ [MEDIA] Error recargando:", error);
    } finally {
      setCargando(false);
    }
  };

  const guardarEnGaleria = async (uri: string, ancho: number, alto: number) => {
    if (galeria.length >= LIMITE_GALERIA) return null;

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
    await actualizarStats("guardada");
    await recargar();
    return nueva;
  };

  const enviarABasura = async (uri: string, ancho: number, alto: number) => {
    if (basura.length >= LIMITE_BASURA) {
      const masAntigua = basura.sort((a, b) => (a.eliminadaEn || 0) - (b.eliminadaEn || 0))[0];
      if (masAntigua) await eliminarDefinitiva(masAntigua.id);
    }

    const id = Date.now().toString();
    const destino = `${MEDIA_DIR}${id}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: destino });

    const nueva: Imagen = {
      id,
      fuente: destino,
      fecha: Date.now(),
      ancho,
      alto,
      enBasura: true,
      eliminadaEn: Date.now(),
    };

    const actualizadas = [...imagenes, nueva];
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(actualizadas));
    await actualizarStats("eliminada");
    await recargar();
    return true;
  };

  const recuperar = async (id: string) => {
    const actualizadas = imagenes.map(i =>
      i.id === id ? { ...i, enBasura: false, eliminadaEn: undefined } : i
    );
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(actualizadas));
    await recargar();
    return true;
  };

  const eliminarDefinitiva = async (id: string) => {
    const imagen = imagenes.find(i => i.id === id);
    if (imagen) {
      await FileSystem.deleteAsync(imagen.fuente);
    }
    const filtradas = imagenes.filter(i => i.id !== id);
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(filtradas));
    await recargar();
    return true;
  };

  const limpiarBasuraAntigua = async (lista: Imagen[]) => {
    const ahora = Date.now();
    const limite = ahora - DIAS_AUTO_BORRADO * 24 * 60 * 60 * 1000;
    const porEliminar = lista.filter(i => i.enBasura && i.eliminadaEn && i.eliminadaEn < limite);
    for (const img of porEliminar) {
      await eliminarDefinitiva(img.id);
    }
  };

  const actualizarStats = async (accion: "guardada" | "eliminada") => {
    const statsData = await AsyncStorage.getItem(STATS_KEY);
    const base: EstadisticasImagenes = statsData
      ? JSON.parse(statsData)
      : { tomadas: 0, guardadas: 0, eliminadas: 0, enGaleria: 0, enBasura: 0 };

    base.tomadas += 1;
    if (accion === "guardada") base.guardadas += 1;
    else base.eliminadas += 1;

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(base));
    setEstadisticas(base);
  };

  const vaciarBasura = async () => {
    for (const img of basura) {
      await eliminarDefinitiva(img.id);
    }
    await recargar();
    return true;
  };

  const galeriaLlena = galeria.length >= LIMITE_GALERIA;
  const basuraLlena = basura.length >= LIMITE_BASURA;

  return {
    imagenes,
    galeria,
    basura,
    estadisticas,
    cargando,
    galeriaLlena,
    basuraLlena,
    guardarEnGaleria,
    enviarABasura,
    recuperar,
    eliminarDefinitiva,
    vaciarBasura,
    recargar,
  };
}
