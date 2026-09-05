import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INCIDENT = {
  title: "High error rate on /api/checkout",
  source: "Sentry",
  severity: "critical" as const,
  time: "2 minutes ago",
  status: "OPEN",
};

export default function IncidentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState("");
  const [resolved, setResolved] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pb-6 pt-4">
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-bg-surface">
            <Ionicons name="arrow-back" size={20} color="#F5F6FA" />
          </Pressable>
          <View>
            <Text className="text-sm text-text-secondary">Incident #{id}</Text>
            <Text className="mt-0.5 text-2xl font-bold text-text-primary">Details</Text>
          </View>
        </View>
        <Card className="border-status-critical/40 bg-status-critical/10">
          <View className="flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-xl font-bold leading-7 text-text-primary">{INCIDENT.title}</Text>
              <Text className="mt-2 text-sm text-text-secondary">{INCIDENT.source} · {INCIDENT.time}</Text>
            </View>
            <StatusBadge severity={INCIDENT.severity} label={resolved ? "RESOLVED" : INCIDENT.status} />
          </View>
        </Card>
        <Text className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[2px] text-text-secondary">Payload</Text>
        <Card className="bg-bg-surface-raised">
          <Text className="font-mono text-sm leading-6 text-text-secondary">{"{\n  status: 500,\n  endpoint: /api/checkout,\n  error_rate: 18.4%\n}"}</Text>
        </Card>
        <Text className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[2px] text-text-secondary">Escalation timeline</Text>
        <Card className="p-0 px-5">
          {[["You", "Notified 2 minutes ago", true], ["Alex K.", "Fallback in 8 minutes", false]].map(([name, detail, active], index) => (
            <View key={String(name)} className="flex-row items-center py-4">
              <View className={`mr-3 h-2.5 w-2.5 rounded-full ${active ? "bg-status-critical" : "bg-border-subtle"}`} />
              <View className="flex-1"><Text className="text-[15px] font-semibold text-text-primary">{name}</Text><Text className="mt-0.5 text-xs text-text-secondary">{detail}</Text></View>
              {index === 0 && <Ionicons name="checkmark-circle" size={18} color="#F5484B" />}
            </View>
          ))}
        </Card>
        <Text className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[2px] text-text-secondary">Add a note</Text>
        <TextInput value={note} onChangeText={setNote} placeholder="What did you find?" placeholderTextColor="#6B7280" multiline className="min-h-[88px] rounded-2xl border border-border-subtle bg-bg-surface-raised px-4 py-3 text-sm text-text-primary" textAlignVertical="top" />
        <View className="mt-5 flex-row gap-3">
          <PrimaryButton label={resolved ? "Resolved" : "Resolve incident"} variant="primary" className="flex-1" leftIcon={<Ionicons name="checkmark" size={18} color="#fff" />} onPress={() => setResolved(true)} disabled={resolved} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
