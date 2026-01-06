import { useState, useEffect } from "react";
import axios from "axios";
import { Perfil } from "../types/perfil";

const API_URL = "http://localhost:3000/perfiles"; // tu JSON Server

export function usePerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    try {
      setCargando(true);
      const { data } = await axios.get<Perfil[]>(API_URL);
      setPerfiles(data);
    } catch (error) {
      console.error("❌ Error cargando perfiles:", error);
    } finally {
      setCargando(false);
    }
  };

  const darLike = async (id: string) => {
    try {
      await axios.post(`${API_URL}/${id}/like`);
      setPerfiles(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("❌ Error dando like:", error);
    }
  };

  const rechazar = async (id: string) => {
    try {
      await axios.post(`${API_URL}/${id}/rechazar`);
      setPerfiles(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("❌ Error rechazando perfil:", error);
    }
  };

  return { perfiles, cargando, cargarPerfiles, darLike, rechazar };
}
