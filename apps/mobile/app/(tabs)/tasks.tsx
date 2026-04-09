import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksTab() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-zinc-50">Tasks</Text>
        <Text className="text-sm text-zinc-400 mt-1">
          Actions extracted from your sessions
        </Text>
      </View>

      <View className="flex-1 items-center justify-center gap-3">
        <Ionicons name="checkmark-done-outline" size={48} color="#52525B" />
        <Text className="text-base font-semibold text-zinc-300">
          No open tasks
        </Text>
        <Text className="text-sm text-zinc-500 text-center px-10">
          Record a brain dump to extract tasks automatically.
        </Text>
      </View>
    </SafeAreaView>
  );
}
