import { OnboardingFrame, OnboardingIcon } from "@/components/onboarding/OnboardingFrame";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Cadence = "daily" | "weekly";

export default function RotationSetup() {
  const { teamValue, mode } = useLocalSearchParams<{ teamValue?: string; mode?: string }>();
  const [cadence, setCadence] = useState<Cadence>("weekly");
  const [members, setMembers] = useState("");

  return (
    <OnboardingFrame
      step={2}
      title="Build your rotation"
      subtitle="Choose how alerts move through your team when something breaks."
    >
      <View className="mb-6 flex-row items-center rounded-2xl border border-border-subtle bg-bg-surface p-4">
        <OnboardingIcon name="git-network-outline" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold text-text-primary">
            {mode === "join" ? `Joining ${teamValue ?? "your team"}` : teamValue ?? "Your team"}
          </Text>
          <Text className="mt-1 text-xs text-text-secondary">One rotation to start. You can change it later.</Text>
        </View>
      </View>

      <Text className="mb-3 text-sm font-semibold text-text-primary">Rotation cadence</Text>
      <View className="mb-7 flex-row gap-3">
        {(["daily", "weekly"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setCadence(item)}
            className={`flex-1 rounded-2xl border p-4 ${cadence === item ? "border-accent-primary bg-accent-primary/15" : "border-border-subtle bg-bg-surface"}`}
          >
            <Ionicons name={item === "daily" ? "sunny-outline" : "calendar-outline"} size={22} color={cadence === item ? "#5B6EF5" : "#9AA1B9"} />
            <Text className="mt-3 text-base font-semibold capitalize text-text-primary">{item}</Text>
            <Text className="mt-1 text-xs text-text-secondary">{item === "daily" ? "Hand off every day" : "Hand off every week"}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-2 text-sm font-semibold text-text-primary">Team members</Text>
      <Text className="mb-2 text-xs leading-5 text-text-secondary">Add email addresses separated by commas. You can invite people later too.</Text>
      <TextInput
        value={members}
        onChangeText={setMembers}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="alex@company.com, priya@company.com"
        placeholderTextColor="#6B7280"
        className="min-h-[86px] rounded-2xl border border-border-subtle bg-bg-surface-raised px-4 py-3 text-sm text-text-primary"
        multiline
        textAlignVertical="top"
      />

      <PrimaryButton
        label="Continue"
        className="mt-8"
        onPress={() =>
          router.push({
            pathname: "/(onboarding)/notifications",
            params: { teamValue: teamValue ?? "", mode: mode ?? "create", cadence, members },
          })
        }
      />
    </OnboardingFrame>
  );
}
