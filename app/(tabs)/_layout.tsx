import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export default function TabsLayout() {
  const vibrar = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Tabs
      initialRouteName="camara" // ✅ coincide con tu archivo camara.tsx
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#030712",
          borderTopWidth: 1,
          borderTopColor: "#1f2937",
          height: 88,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
      screenListeners={{
        tabPress: vibrar,
      }}
    >
      {/* Ocultar index */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: () => null,
        }}
      />

      {/* Cámara */}
      <Tabs.Screen
        name="camara"
        options={{
          title: "Cámara",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              size={size + 1}
              color={color}
            />
          ),
        }}
      />

      {/* Media (Galería + Papelera) */}
      <Tabs.Screen
        name="media"
        options={{
          title: "Media",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "images" : "images-outline"}
              size={size + 1}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
