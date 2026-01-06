import { ViewProps, TextProps } from "react-native";

declare module "react-native" {
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const Image: React.FC<any>;
}
