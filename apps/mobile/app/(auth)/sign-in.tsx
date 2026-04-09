import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

export default function SignInScreen() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleGoogle = async () => {
    setLoading("google");
    const webUrl = `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/api/auth/signin/google`;
    await Linking.openURL(webUrl);
    // After returning from browser, try to refresh session
    setTimeout(async () => {
      await refresh();
      setLoading(null);
    }, 2000);
  };

  const handleEmail = async () => {
    if (!email.trim()) return;
    setLoading("email");
    try {
      await api.post("/api/auth/signin/email", {
        email: email.trim(),
        redirect: false,
      });
      setEmailSent(true);
    } catch {
      Alert.alert("Error", "Could not send magic link. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center px-6">
        <Ionicons name="mail-outline" size={48} color="#7C3AED" />
        <Text className="text-xl font-bold text-zinc-50 mt-4">
          Check your inbox
        </Text>
        <Text className="text-sm text-zinc-400 text-center mt-2 leading-relaxed">
          We sent a sign-in link to{" "}
          <Text className="text-zinc-200">{email}</Text>. Tap it to continue.
        </Text>
        <Pressable
          onPress={() => setEmailSent(false)}
          className="mt-6"
        >
          <Text className="text-violet-400 text-sm">Use a different email</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center px-6">
      {/* Logo */}
      <View className="h-16 w-16 rounded-2xl bg-violet-600 items-center justify-center mb-6">
        <Text className="text-3xl">✦</Text>
      </View>

      <Text className="text-2xl font-bold text-zinc-50 mb-1">
        Sign in to Acuity
      </Text>
      <Text className="text-sm text-zinc-400 mb-8">
        Your nightly brain dump awaits.
      </Text>

      {/* Google */}
      <Pressable
        onPress={handleGoogle}
        disabled={loading !== null}
        className="w-full flex-row items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3.5 mb-4"
        style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
      >
        {loading === "google" ? (
          <ActivityIndicator size="small" color="#FAFAFA" />
        ) : (
          <Ionicons name="logo-google" size={18} color="#FAFAFA" />
        )}
        <Text className="text-sm font-medium text-zinc-100">
          {loading === "google" ? "Opening..." : "Continue with Google"}
        </Text>
      </Pressable>

      {/* Divider */}
      <View className="w-full flex-row items-center gap-3 mb-4">
        <View className="flex-1 h-px bg-zinc-800" />
        <Text className="text-xs text-zinc-500">or</Text>
        <View className="flex-1 h-px bg-zinc-800" />
      </View>

      {/* Magic link */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#52525B"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3.5 text-sm text-zinc-100 mb-3"
      />
      <Pressable
        onPress={handleEmail}
        disabled={loading !== null || !email.trim()}
        className="w-full items-center justify-center rounded-xl bg-violet-600 py-3.5"
        style={({ pressed }) => ({
          opacity: pressed || loading || !email.trim() ? 0.6 : 1,
        })}
      >
        {loading === "email" ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-sm font-semibold text-white">
            Send magic link
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
