import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OnboardingFrameProps {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function OnboardingFrame({ step, title, subtitle, children }: OnboardingFrameProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="min-h-full px-5 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between pb-10 pt-5">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent-primary">
                <Text className="text-lg font-bold text-white">P</Text>
              </View>
              <Text className="ml-2.5 text-base font-semibold text-text-primary">PocketPage</Text>
            </View>
            <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-text-secondary">
              Step {step} of 3
            </Text>
          </View>

          <View className="mb-8">
            <View className="mb-5 flex-row gap-2">
              {[1, 2, 3].map((item) => (
                <View
                  key={item}
                  className={`h-1 flex-1 rounded-full ${item <= step ? "bg-accent-primary" : "bg-bg-surface-raised"}`}
                />
              ))}
            </View>
            <Text className="text-3xl font-bold leading-9 text-text-primary">{title}</Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">{subtitle}</Text>
          </View>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function OnboardingIcon({ name, color = "#5B6EF5" }: { name: keyof typeof Ionicons.glyphMap; color?: string }) {
  return (
    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent-primary/15">
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}
