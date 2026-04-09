import { Ionicons } from "@expo/vector-icons";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-zinc-50">Profile</Text>
        <Text className="text-sm text-zinc-400 mt-1">
          Account &amp; settings
        </Text>
      </View>

      {/* Avatar placeholder */}
      <View className="items-center mt-8 mb-6">
        <View className="h-20 w-20 rounded-full bg-violet-600/20 items-center justify-center border border-violet-600/40">
          <Ionicons name="person" size={36} color="#7C3AED" />
        </View>
        <Text className="text-zinc-100 font-semibold text-lg mt-3">
          Your Name
        </Text>
        <Text className="text-zinc-500 text-sm">you@example.com</Text>
      </View>

      {/* Menu items */}
      <View className="px-5 gap-2">
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            className="flex-row items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name={item.icon} size={20} color="#71717A" />
            <Text className="flex-1 text-sm text-zinc-200">{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#52525B" />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const MENU_ITEMS: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { label: "Upgrade to Pro", icon: "star-outline" },
  { label: "Notification settings", icon: "notifications-outline" },
  { label: "Reminder time", icon: "time-outline" },
  { label: "Sign out", icon: "log-out-outline" },
];
