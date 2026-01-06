import { useState } from "react";
import { Usuario } from "../types/usuario";

export function useAutenticacion() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (nombre: string, email: string) => {
    const nuevoUsuario: Usuario = { id: Date.now().toString(), nombre, email };
    setUsuario(nuevoUsuario);
  };

  const logout = () => setUsuario(null);

  return { usuario, login, logout };
}
