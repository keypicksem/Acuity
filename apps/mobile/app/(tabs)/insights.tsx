import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InsightsTab() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-zinc-50">Insights</Text>
        <Text className="text-sm text-zinc-400 mt-1">
          Patterns across your sessions
        </Text>
      </View>

      <View className="flex-1 items-center justify-center gap-3">
        <Ionicons name="bulb-outline" size={48} color="#52525B" />
        <Text className="text-base font-semibold text-zinc-300">
          Not enough data yet
        </Text>
        <Text className="text-sm text-zinc-500 text-center px-10">
          Record at least 3 sessions to unlock weekly insights.
        </Text>
      </View>
    </SafeAreaView>
  );
}
