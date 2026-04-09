import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="entry/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#09090B" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontWeight: "600" },
            title: "Entry",
          }}
        />
        <Stack.Screen
          name="record"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#09090B" },
            headerTintColor: "#FAFAFA",
            headerTitleStyle: { fontWeight: "600" },
            title: "Brain dump",
            presentation: "modal",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
