import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "@/global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="photo/[id]"
          options={{
            presentation: "modal",
            animation: "fade",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
