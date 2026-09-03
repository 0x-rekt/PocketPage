import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RotationSlot {
  id: string;
  name: string;
  avatar: string;
  shift: string;
  isCurrent: boolean;
}

const ROTATION: RotationSlot[] = [
  {
    id: "1",
    name: "You",
    avatar: "Y",
    shift: "Wed 06:00 – Thu 06:00",
    isCurrent: true,
  },
  {
    id: "2",
    name: "Alex K.",
    avatar: "A",
    shift: "Thu 06:00 – Fri 06:00",
    isCurrent: false,
  },
  {
    id: "3",
    name: "Priya M.",
    avatar: "P",
    shift: "Fri 06:00 – Mon 06:00",
    isCurrent: false,
  },
  {
    id: "4",
    name: "Ben T.",
    avatar: "B",
    shift: "Mon 06:00 – Tue 06:00",
    isCurrent: false,
  },
  {
    id: "5",
    name: "Sofia R.",
    avatar: "S",
    shift: "Tue 06:00 – Wed 06:00",
    isCurrent: false,
  },
];

function RotationRow({ slot }: { slot: RotationSlot }) {
  return (
    <View className="flex-row items-center py-3.5">
      {/* Avatar */}
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${
          slot.isCurrent ? "bg-accent-primary" : "bg-bg-surface-raised"
        }`}
      >
        <Text
          className={`text-sm font-bold ${
            slot.isCurrent ? "text-white" : "text-text-secondary"
          }`}
        >
          {slot.avatar}
        </Text>
      </View>

      {/* Name + shift */}
      <View className="ml-3 flex-1">
        <Text
          className={`text-[15px] font-semibold ${
            slot.isCurrent ? "text-text-primary" : "text-text-secondary"
          }`}
        >
          {slot.name}
        </Text>
        <Text className="mt-0.5 text-xs text-text-secondary">{slot.shift}</Text>
      </View>

      {/* Current indicator */}
      {slot.isCurrent && (
        <View className="rounded-full bg-accent-primary/20 px-2.5 py-0.5">
          <Text className="text-[11px] font-semibold text-accent-primary">
            NOW
          </Text>
        </View>
      )}
    </View>
  );
}

export default function Schedule() {
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pb-6 pt-5">
          <Text className="text-2xl font-bold tracking-tight text-text-primary">
            Schedule
          </Text>
          <Text className="mt-1 text-[14px] text-text-secondary">
            Weekly on-call rotation
          </Text>
        </View>

        {/* Who's on call now card */}
        <Card className="bg-accent-primary/10 border-accent-primary/30">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-accent-primary">
              <Text className="text-lg font-bold text-white">Y</Text>
            </View>
            <View className="flex-1">
              <SectionLabel className="text-accent-primary">
                Currently On Call
              </SectionLabel>
              <Text className="mt-1 text-xl font-bold text-text-primary">
                You
              </Text>
              <Text className="mt-0.5 text-sm text-text-secondary">
                Until Thu 06:00 · 31h remaining
              </Text>
            </View>
            <Ionicons name="radio-button-on" size={14} color="#5B6EF5" />
          </View>
        </Card>

        {/* Override / Claim */}
        <PrimaryButton
          label="Request Swap / Override"
          variant="secondary"
          className="mt-3"
          leftIcon={
            <Ionicons name="swap-horizontal" size={18} color="#F5F6FA" />
          }
        />

        {/* Upcoming rotation */}
        <SectionLabel className="mb-3 mt-8">Upcoming Rotation</SectionLabel>
        <Card className="p-0 px-5">
          {ROTATION.map((slot, i) => (
            <View key={slot.id}>
              <RotationRow slot={slot} />
              {i < ROTATION.length - 1 && (
                <View className="h-px bg-border-subtle" />
              )}
            </View>
          ))}
        </Card>

        {/* Manage team hint */}
        <Pressable className="mt-4 flex-row items-center justify-center gap-1.5 active:opacity-70">
          <Ionicons name="people-outline" size={14} color="#5B6EF5" />
          <Text className="text-sm font-semibold text-accent-primary">
            Manage team members
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
