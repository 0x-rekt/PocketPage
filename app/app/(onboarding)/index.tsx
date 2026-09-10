import { OnboardingFrame, OnboardingIcon } from "@/components/onboarding/OnboardingFrame";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function TeamSetup() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [value, setValue] = useState("");

  const canContinue = value.trim().length > 1;

  return (
    <OnboardingFrame
      step={1}
      title={mode === "create" ? "Set up your team" : "Join your team"}
      subtitle={
        mode === "create"
          ? "Create a shared space for your on-call rotation."
          : "Enter the invite code your team shared with you."
      }
    >
      <View className="mb-8 flex-row rounded-2xl bg-bg-surface-raised p-1">
        {([
          ["create", "Create team"],
          ["join", "Join with code"],
        ] as const).map(([item, label]) => (
          <Pressable
            key={item}
            onPress={() => setMode(item)}
            className={`flex-1 items-center rounded-xl px-3 py-3 ${mode === item ? "bg-accent-primary" : ""}`}
          >
            <Text className={`text-sm font-semibold ${mode === item ? "text-white" : "text-text-secondary"}`}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mb-6 flex-row items-center rounded-2xl border border-border-subtle bg-bg-surface p-4">
        <OnboardingIcon name={mode === "create" ? "people-outline" : "link-outline"} />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold text-text-primary">
            {mode === "create" ? "Your engineering team" : "Team invite"}
          </Text>
          <Text className="mt-1 text-xs leading-5 text-text-secondary">
            {mode === "create" ? "You can invite teammates after setup." : "Invite codes are case-insensitive."}
          </Text>
        </View>
      </View>

      <Text className="mb-2 text-sm font-semibold text-text-primary">
        {mode === "create" ? "Team name" : "Invite code"}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        autoCapitalize={mode === "create" ? "words" : "characters"}
        placeholder={mode === "create" ? "e.g. Acme Engineering" : "e.g. PP-7K4M"}
        placeholderTextColor="#6B7280"
        className="h-14 rounded-2xl border border-border-subtle bg-bg-surface-raised px-4 text-base text-text-primary"
      />

      <PrimaryButton
        label="Continue"
        className="mt-8"
        disabled={!canContinue}
        onPress={() =>
          router.push({
            pathname: "/(onboarding)/rotation",
            params: { teamValue: value.trim(), mode },
          })
        }
      />
    </OnboardingFrame>
  );
}
