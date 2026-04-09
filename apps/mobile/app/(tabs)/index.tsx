import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOOD_EMOJI, type EntryDTO } from "@acuity/shared";
import { api } from "@/lib/api";

export default function RecordTab() {
  const router = useRouter();
  const [entries, setEntries] = useState<EntryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ entries: EntryDTO[] }>("/api/entries")
      .then((d) => setEntries(d.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#7C3AED" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}
          ListHeaderComponent={<Header />}
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item }) => <EntryRow entry={item} />}
        />
      )}

      {/* Record FAB */}
      <Pressable
        onPress={() => router.push("/record")}
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-violet-600 shadow-lg"
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Ionicons name="mic" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-zinc-50">Acuity</Text>
      <Text className="text-sm text-zinc-400 mt-1">Your nightly brain dump</Text>
    </View>
  );
}

function EntryRow({ entry }: { entry: EntryDTO }) {
  const router = useRouter();
  const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={() => router.push(`/entry/${entry.id}`)}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs text-zinc-500">{date}</Text>
        {entry.mood && (
          <Text className="text-xs text-zinc-400">
            {MOOD_EMOJI[entry.mood]}
            {entry.energy != null ? ` · ${entry.energy}/10` : ""}
          </Text>
        )}
      </View>
      <Text className="text-sm text-zinc-100 leading-snug" numberOfLines={2}>
        {entry.summary ?? "No summary"}
      </Text>
      {entry.themes.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 mt-2">
          {entry.themes.map((t) => (
            <View key={t} className="rounded-full bg-zinc-800 px-2.5 py-0.5">
              <Text className="text-xs text-zinc-400">{t}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="mt-20 items-center">
      <Ionicons name="mic-outline" size={48} color="#52525B" />
      <Text className="text-base font-semibold text-zinc-300 mt-3">
        No entries yet
      </Text>
      <Text className="text-sm text-zinc-500 mt-1 text-center px-8">
        Tap the mic button to record your first brain dump.
      </Text>
    </View>
  );
}
