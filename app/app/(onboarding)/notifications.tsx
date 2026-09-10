import { ONBOARDING_METADATA_KEY } from "@/lib/onboarding";
import { OnboardingFrame, OnboardingIcon } from "@/components/onboarding/OnboardingFrame";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";

export default function NotificationSetup() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const params = useLocalSearchParams<{ teamValue?: string; mode?: string; cadence?: string; members?: string }>();
  const [criticalEnabled, setCriticalEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const finishSetup = async () => {
    if (!user || loading) return;
    setLoading(true);

    try {
      const token = await getToken();
      const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/onboarding/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          teamName: params.teamValue ?? "",
          teamMode: params.mode ?? "create",
          cadence: params.cadence === "daily" ? "daily" : "weekly",
          memberEmails: (params.members ?? "")
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Could not save your team");
      }

      await user.updateMetadata({
        unsafeMetadata: {
          [ONBOARDING_METADATA_KEY]: {
            completed: true,
            team: params.teamValue ?? "",
            teamMode: params.mode ?? "create",
            cadence: params.cadence ?? "weekly",
            members: params.members ?? "",
            criticalNotifications: criticalEnabled,
            completedAt: new Date().toISOString(),
          },
        },
      });
      router.replace("/(app)");
    } catch (error) {
      console.error("Failed to save onboarding", error);
      Alert.alert("Could not finish setup", "Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingFrame
      step={3}
      title="Make sure you hear us"
      subtitle="Critical pages should reach you when they matter, even at 3am."
    >
      <View className="mb-5 items-center rounded-[22px] border border-status-critical/30 bg-status-critical/10 px-6 py-7">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-status-critical/20">
          <Ionicons name="notifications" size={30} color="#F5484B" />
        </View>
        <Text className="mt-4 text-center text-lg font-bold text-text-primary">Critical alerts</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-text-secondary">
          PocketPage will use push notifications for incidents assigned to you. Critical alert and DND bypass settings can be configured in your native build.
        </Text>
      </View>

      <View className="flex-row items-center rounded-2xl border border-border-subtle bg-bg-surface p-4">
        <OnboardingIcon name="flash-outline" color="#F5484B" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold text-text-primary">Critical push notifications</Text>
          <Text className="mt-1 text-xs text-text-secondary">Recommended for every on-call engineer</Text>
        </View>
        <Switch
          value={criticalEnabled}
          onValueChange={setCriticalEnabled}
          trackColor={{ false: "#252B47", true: "#5B6EF5" }}
          thumbColor="#F5F6FA"
        />
      </View>

      <PrimaryButton
        label="Finish setup"
        loading={loading}
        className="mt-8"
        onPress={() => void finishSetup()}
        leftIcon={<Ionicons name="checkmark" size={18} color="#FFFFFF" />}
      />
      <Pressable onPress={() => void finishSetup()} disabled={loading} className="mt-5 items-center">
        <Text className="text-sm font-semibold text-text-secondary">I&apos;ll configure notifications later</Text>
      </Pressable>
    </OnboardingFrame>
  );
}
