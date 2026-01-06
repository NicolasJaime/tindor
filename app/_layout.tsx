import { Stack } from "expo-router";
import { useTema } from "../lib/hooks/useTema";

export default function Layout() {
  const { temaOscuro } = useTema();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: temaOscuro ? "#111827" : "#ffffff" },
      }}
    />
  );
}
