import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  MOOD_EMOJI,
  MOOD_LABELS,
  PRIORITY_COLOR,
  type ExtractionResult,
} from "@acuity/shared";
import { api } from "@/lib/api";

const MAX_SECONDS = 120;

type RecordState =
  | "idle"
  | "recording"
  | "transcribing"
  | "extracting"
  | "done";

type Result = {
  entryId: string;
  extraction: ExtractionResult;
  tasksCreated: number;
};

export default function RecordTab() {
  const [state, setState] = useState<RecordState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation
  useEffect(() => {
    if (state === "idle") {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state, pulseAnim]);

  // Request mic permission
  useEffect(() => {
    Audio.requestPermissionsAsync();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  const startRecording = async () => {
    const { granted } = await Audio.getPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Microphone access required",
        "Go to Settings > Acuity > Microphone to enable access."
      );
      return;
    }

    setResult(null);
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();
    recordingRef.current = recording;
    setElapsed(0);
    setState("recording");

    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= MAX_SECONDS) {
          stopRecording();
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recording = recordingRef.current;
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recordingRef.current = null;

    if (!uri) {
      Alert.alert("Error", "No audio recorded.");
      setState("idle");
      return;
    }

    await uploadRecording(uri, elapsed);
  };

  const uploadRecording = async (uri: string, duration: number) => {
    setState("transcribing");

    const formData = new FormData();
    formData.append("audio", {
      uri,
      name: "recording.m4a",
      type: "audio/m4a",
    } as unknown as Blob);
    formData.append("durationSeconds", String(duration));

    try {
      // Simulate staged processing for UX
      const transcribeTimeout = setTimeout(
        () => setState("extracting"),
        3000
      );

      const data = await api.upload<{
        entryId: string;
        extraction: ExtractionResult;
        tasksCreated: number;
      }>("/api/record", formData);

      clearTimeout(transcribeTimeout);
      setResult(data);
      setState("done");
    } catch (err) {
      Alert.alert(
        "Upload failed",
        err instanceof Error ? err.message : "Please try again."
      );
      setState("idle");
    }
  };

  const handlePress = () => {
    if (state === "recording") {
      stopRecording();
    } else if (state === "idle" || state === "done") {
      setState("idle");
      setResult(null);
      startRecording();
    }
  };

  const isProcessing = state === "transcribing" || state === "extracting";

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={["top"]}>
      {state === "done" && result ? (
        <ResultCard result={result} onNewRecording={handlePress} />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          {isProcessing ? (
            <View className="items-center gap-4">
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text className="text-zinc-400 text-sm">
                {state === "transcribing"
                  ? "Transcribing..."
                  : "Extracting insights..."}
              </Text>
            </View>
          ) : (
            <View className="items-center gap-8">
              {/* Status text */}
              <View className="items-center gap-2">
                <Text className="text-zinc-100 text-xl font-semibold">
                  {state === "recording" ? "Recording..." : "Ready to record"}
                </Text>
                {state === "recording" ? (
                  <Text className="text-zinc-400 text-3xl font-mono">
                    {formatTime(elapsed)}
                  </Text>
                ) : (
                  <Text className="text-zinc-500 text-sm">
                    Up to 2 minutes
                  </Text>
                )}
              </View>

              {/* Mic button */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Pressable
                  onPress={handlePress}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <View
                    className={`h-32 w-32 rounded-full items-center justify-center ${
                      state === "recording" ? "bg-red-600" : "bg-violet-600"
                    }`}
                    style={
                      state === "idle"
                        ? {
                            shadowColor: "#7C3AED",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 24,
                            elevation: 12,
                          }
                        : undefined
                    }
                  >
                    {state === "recording" ? (
                      <View className="h-10 w-10 rounded bg-white" />
                    ) : (
                      <Ionicons name="mic" size={48} color="#fff" />
                    )}
                  </View>
                </Pressable>
              </Animated.View>

              {/* Helper text */}
              <Text className="text-zinc-500 text-sm text-center">
                {state === "recording"
                  ? "Tap to stop"
                  : "Tap to start your brain dump"}
              </Text>

              {/* Progress bar for recording */}
              {state === "recording" && (
                <View className="w-48 h-1 rounded-full bg-zinc-800">
                  <View
                    className="h-1 rounded-full bg-red-500"
                    style={{
                      width: `${(elapsed / MAX_SECONDS) * 100}%`,
                    }}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

function ResultCard({
  result,
  onNewRecording,
}: {
  result: Result;
  onNewRecording: () => void;
}) {
  const { extraction } = result;
  const moodEmoji = MOOD_EMOJI[extraction.mood] ?? "";
  const moodLabel = MOOD_LABELS[extraction.mood] ?? extraction.mood;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="items-center mb-6">
        <Text className="text-4xl mb-2">✅</Text>
        <Text className="text-xl font-bold text-zinc-50">Session Complete</Text>
      </View>

      {/* Mood & Energy */}
      <View className="flex-row justify-center gap-6 mb-6">
        <View className="items-center">
          <Text className="text-3xl">{moodEmoji}</Text>
          <Text className="text-xs text-zinc-400 mt-1">{moodLabel}</Text>
        </View>
        <View className="items-center">
          <Text className="text-3xl text-zinc-100">{extraction.moodScore}</Text>
          <Text className="text-xs text-zinc-400 mt-1">Mood Score</Text>
        </View>
        <View className="items-center">
          <Text className="text-3xl text-zinc-100">{extraction.energy}</Text>
          <Text className="text-xs text-zinc-400 mt-1">Energy</Text>
        </View>
      </View>

      {/* Summary */}
      <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 mb-4">
        <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Summary
        </Text>
        <Text className="text-sm text-zinc-200 leading-relaxed">
          {extraction.summary}
        </Text>
      </View>

      {/* Themes */}
      {extraction.themes.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 mb-4">
          {extraction.themes.map((t) => (
            <View key={t} className="rounded-full bg-zinc-800 px-3 py-1">
              <Text className="text-xs text-zinc-400">{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tasks */}
      {extraction.tasks.length > 0 && (
        <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 mb-4">
          <Text className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Extracted Tasks ({extraction.tasks.length})
          </Text>
          {extraction.tasks.map((task, i) => (
            <View
              key={i}
              className={`flex-row items-start gap-2.5 ${
                i > 0 ? "mt-2.5 pt-2.5 border-t border-zinc-800" : ""
              }`}
            >
              <View
                className="mt-1 h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    PRIORITY_COLOR[task.priority] ?? "#71717A",
                }}
              />
              <View className="flex-1">
                <Text className="text-sm text-zinc-200">{task.title}</Text>
                <Text className="text-xs text-zinc-500 mt-0.5">
                  {task.priority}
                  {task.dueDate ? ` · Due ${task.dueDate}` : ""}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Insights */}
      {extraction.insights.length > 0 && (
        <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 mb-6">
          <Text className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">
            Insights
          </Text>
          {extraction.insights.map((insight, i) => (
            <View key={i} className={`flex-row gap-2 ${i > 0 ? "mt-2" : ""}`}>
              <Text className="text-violet-400 text-sm">-</Text>
              <Text className="text-sm text-zinc-300 flex-1">{insight}</Text>
            </View>
          ))}
        </View>
      )}

      {/* New recording button */}
      <Pressable
        onPress={onNewRecording}
        className="rounded-2xl bg-violet-600 py-4 items-center"
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Text className="text-sm font-semibold text-white">
          Record Another
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
