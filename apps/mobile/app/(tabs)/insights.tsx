import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOOD_EMOJI, type EntryDTO } from "@acuity/shared";
import { api } from "@/lib/api";

type Report = {
  id: string;
  weekStart: string;
  weekEnd: string;
  narrative: string | null;
  insightBullets: string[];
  moodArc: string | null;
  topThemes: string[];
  tasksOpened: number;
  tasksClosed: number;
  entryCount: number;
  status: string;
};

const MOOD_COLORS: Record<string, string> = {
  GREAT: "#22C55E",
  GOOD: "#86EFAC",
  NEUTRAL: "#71717A",
  LOW: "#FBBF24",
  ROUGH: "#EF4444",
};

export default function InsightsTab() {
  const [entries, setEntries] = useState<EntryDTO[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, reportsRes] = await Promise.all([
        api.get<{ entries: EntryDTO[] }>("/api/entries"),
        api.get<{ reports: Report[] }>("/api/weekly"),
      ]);
      setEntries(entriesRes.entries?.slice(0, 7) ?? []);
      setReports(reportsRes.reports ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      await api.post("/api/weekly", {});
      await fetchData();
    } catch (err) {
      Alert.alert(
        "Cannot generate",
        err instanceof Error ? err.message : "Need at least 3 sessions this week."
      );
    } finally {
      setGenerating(false);
    }
  };

  const latestReport = reports.find((r) => r.status === "COMPLETE");
  const moodEntries = entries.filter((e) => e.moodScore != null);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center" edges={["top"]}>
        <ActivityIndicator color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
          />
        }
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-zinc-50">Insights</Text>
          <Text className="text-sm text-zinc-400 mt-1">
            Patterns across your sessions
          </Text>
        </View>

        {/* Mood chart */}
        {moodEntries.length > 0 ? (
          <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 mb-6">
            <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Mood Trend
            </Text>
            <View className="flex-row items-end gap-2" style={{ height: 120 }}>
              {moodEntries.map((entry) => {
                const score = entry.moodScore ?? 5;
                const heightPct = (score / 10) * 100;
                const color =
                  MOOD_COLORS[entry.mood ?? "NEUTRAL"] ?? MOOD_COLORS.NEUTRAL;
                const day = new Date(entry.createdAt).toLocaleDateString(
                  "en-US",
                  { weekday: "narrow" }
                );

                return (
                  <View
                    key={entry.id}
                    className="flex-1 items-center gap-1"
                  >
                    <Text className="text-xs text-zinc-400">{score}</Text>
                    <View className="w-full items-center" style={{ height: 80 }}>
                      <View
                        className="w-full rounded-t-md"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: color,
                          opacity: 0.8,
                          position: "absolute",
                          bottom: 0,
                        }}
                      />
                    </View>
                    <Text className="text-xs text-zinc-600">
                      {MOOD_EMOJI[entry.mood ?? "NEUTRAL"] ?? day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View className="rounded-2xl border border-dashed border-zinc-800 p-6 items-center mb-6">
            <Ionicons name="bar-chart-outline" size={32} color="#52525B" />
            <Text className="text-sm font-medium text-zinc-400 mt-2">
              No mood data yet
            </Text>
            <Text className="text-xs text-zinc-600 mt-1 text-center">
              Record sessions to see your mood trend.
            </Text>
          </View>
        )}

        {/* Generate button */}
        <Pressable
          onPress={generateReport}
          disabled={generating}
          className="rounded-2xl bg-violet-600 py-4 items-center mb-6"
          style={({ pressed }) => ({
            opacity: pressed || generating ? 0.7 : 1,
          })}
        >
          {generating ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-sm font-semibold text-white">
                Generating...
              </Text>
            </View>
          ) : (
            <Text className="text-sm font-semibold text-white">
              Generate Weekly Report
            </Text>
          )}
        </Pressable>

        {/* Latest report */}
        {latestReport ? (
          <View className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            {/* Header */}
            <View className="px-4 py-3 border-b border-zinc-800">
              <Text className="text-xs text-zinc-500">
                {new Date(latestReport.weekStart).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(latestReport.weekEnd).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
              <Text className="text-xs text-zinc-600 mt-0.5">
                {latestReport.entryCount} entries ·{" "}
                {latestReport.tasksOpened} tasks ·{" "}
                {latestReport.tasksClosed} closed
              </Text>
            </View>

            {/* Narrative */}
            {latestReport.narrative && (
              <View className="px-4 py-3 border-b border-zinc-800">
                <Text className="text-sm text-zinc-300 leading-relaxed">
                  {latestReport.narrative}
                </Text>
              </View>
            )}

            {/* Mood arc */}
            {latestReport.moodArc && (
              <View className="px-4 py-3 border-b border-zinc-800">
                <Text className="text-xs font-semibold text-zinc-500 mb-1">
                  Mood Arc
                </Text>
                <Text className="text-sm text-zinc-400">
                  {latestReport.moodArc}
                </Text>
              </View>
            )}

            {/* Insights */}
            {latestReport.insightBullets.length > 0 && (
              <View className="px-4 py-3 border-b border-zinc-800">
                <Text className="text-xs font-semibold text-violet-400 mb-2">
                  Insights
                </Text>
                {latestReport.insightBullets.map((bullet, i) => (
                  <View key={i} className="flex-row gap-2 mb-1.5">
                    <Text className="text-violet-400 text-sm">-</Text>
                    <Text className="text-sm text-zinc-300 flex-1">
                      {bullet}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Themes */}
            {latestReport.topThemes.length > 0 && (
              <View className="px-4 py-3">
                <Text className="text-xs font-semibold text-zinc-500 mb-2">
                  Top Themes
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {latestReport.topThemes.map((theme) => (
                    <View
                      key={theme}
                      className="rounded-full bg-zinc-800 px-2.5 py-1"
                    >
                      <Text className="text-xs text-zinc-400">{theme}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="rounded-2xl border border-dashed border-zinc-800 p-8 items-center">
            <Ionicons name="bulb-outline" size={40} color="#52525B" />
            <Text className="text-sm font-medium text-zinc-400 mt-3">
              No weekly report yet
            </Text>
            <Text className="text-xs text-zinc-600 mt-1 text-center px-4">
              Record at least 3 sessions, then tap Generate Weekly Report.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
