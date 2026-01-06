import { useState } from "react";
import { COLORES } from "../constants/theme";

export function useTema() {
  const [temaOscuro, setTemaOscuro] = useState(false);

  const alternarTema = () => setTemaOscuro(prev => !prev);

  const colores = temaOscuro ? COLORES.grises : COLORES.primarios;

  return { temaOscuro, alternarTema, colores };
}
