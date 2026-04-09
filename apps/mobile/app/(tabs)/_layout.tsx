import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: {
  name: string;
  title: string;
  icon: IoniconsName;
  iconActive: IoniconsName;
}[] = [
  { name: "index", title: "Record", icon: "mic-outline", iconActive: "mic" },
  {
    name: "tasks",
    title: "Tasks",
    icon: "checkmark-done-outline",
    iconActive: "checkmark-done",
  },
  {
    name: "goals",
    title: "Goals",
    icon: "trophy-outline",
    iconActive: "trophy",
  },
  {
    name: "insights",
    title: "Insights",
    icon: "bulb-outline",
    iconActive: "bulb",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#09090B",
          borderTopColor: "#27272A",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#71717A",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      {TABS.map(({ name, title, icon, iconActive }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? iconActive : icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
