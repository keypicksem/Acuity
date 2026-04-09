import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsTab() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-zinc-50">Goals</Text>
        <Text className="text-sm text-zinc-400 mt-1">
          What you're working toward
        </Text>
      </View>

      <View className="flex-1 items-center justify-center gap-3">
        <Ionicons name="trophy-outline" size={48} color="#52525B" />
        <Text className="text-base font-semibold text-zinc-300">
          No active goals
        </Text>
        <Text className="text-sm text-zinc-500 text-center px-10">
          Mention a goal in your brain dump and we'll track it here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
