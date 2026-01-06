// Definiciones de entidades multimedia adaptadas de Photo/Album/Stats
export interface Imagen {
  id: string;
  fuente: string;          // antes era "uri"
  fecha: number;           // antes era "timestamp"
  ancho: number;           // antes era "width"
  alto: number;            // antes era "height"
  enBasura: boolean;       // antes era "inTrash"
  eliminadaEn?: number;    // antes era "deletedAt"
  coleccionId?: string;    // antes era "albumId"
}

export interface Coleccion {
  id: string;
  titulo: string;          // antes era "name"
  creadaEn: number;        // antes era "createdAt"
  imagenesIds: string[];   // antes era "photoIds"
  portada?: string;        // antes era "coverPhotoUri"
}

export interface EstadisticasImagenes {
  tomadas: number;         // antes era "totalTaken"
  guardadas: number;       // antes era "totalSaved"
  eliminadas: number;      // antes era "totalDeleted"
  enGaleria: number;       // antes era "galleryCount"
  enBasura: number;        // antes era "trashCount"
}

// Constantes de límites
export const LIMITE_GALERIA = 15;
export const LIMITE_BASURA = 10;
export const DIAS_AUTO_BORRADO = 7;

// Overrides de React Native para permitir className y tipado extendido
import { ViewProps, TextProps, ImageProps } from "react-native";

declare module "react-native" {
  export const Vista: React.FC<ViewProps>;   // antes era View
  export const Texto: React.FC<TextProps>;   // antes era Text
  export const ImagenRN: React.FC<ImageProps>; // antes era Image
  // Se pueden añadir más si usas FlatList, ScrollView, etc.
}
