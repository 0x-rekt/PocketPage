import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/lib/api";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IncidentDetailData {
  id: string;
  title: string;
  source: string;
  severity: "critical" | "warning" | "success" | "muted";
  status: "open" | "acked" | "resolved";
  payload: unknown;
  createdAt: string;
  ackedAt: string | null;
  resolvedAt: string | null;
}

export default function IncidentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken } = useAuth();
  const [incident, setIncident] = useState<IncidentDetailData | null>(null);
  const [error, setError] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!id) return;
    apiGet(`/api/me/incidents/${id}`, getToken)
      .then((result) => setIncident(result as IncidentDetailData))
      .catch(() => setError(true));
  }, [getToken, id]);

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center pb-6 pt-4">
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-bg-surface"><Ionicons name="arrow-back" size={20} color="#F5F6FA" /></Pressable>
          <View><Text className="text-sm text-text-secondary">Incident #{id}</Text><Text className="mt-0.5 text-2xl font-bold text-text-primary">Details</Text></View>
        </View>
        {error ? <View className="mt-10 items-center"><Ionicons name="cloud-offline-outline" size={36} color="#F5A623" /><Text className="mt-3 text-base font-semibold text-text-primary">Couldn&apos;t load incident</Text></View> : !incident ? <Text className="py-16 text-center text-sm text-text-secondary">Loading incident…</Text> : <>
          <Card className="border-status-critical/40 bg-status-critical/10"><View className="flex-row items-start justify-between"><View className="mr-3 flex-1"><Text className="text-xl font-bold leading-7 text-text-primary">{incident.title}</Text><Text className="mt-2 text-sm text-text-secondary">{incident.source} · {new Date(incident.createdAt).toLocaleString()}</Text></View><StatusBadge severity={incident.severity} label={incident.status.toUpperCase()} /></View></Card>
          <Text className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[2px] text-text-secondary">Payload</Text>
          <Card className="bg-bg-surface-raised"><Text className="font-mono text-sm leading-6 text-text-secondary">{JSON.stringify(incident.payload, null, 2)}</Text></Card>
          <Text className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[2px] text-text-secondary">Timeline</Text>
          <Card><Text className="text-sm text-text-secondary">Received {new Date(incident.createdAt).toLocaleString()}</Text>{incident.ackedAt && <Text className="mt-2 text-sm text-text-secondary">Acknowledged {new Date(incident.ackedAt).toLocaleString()}</Text>}{incident.resolvedAt && <Text className="mt-2 text-sm text-text-secondary">Resolved {new Date(incident.resolvedAt).toLocaleString()}</Text>}</Card>
          <Text className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[2px] text-text-secondary">Add a note</Text>
          <TextInput value={note} onChangeText={setNote} placeholder="What did you find?" placeholderTextColor="#6B7280" multiline className="min-h-[88px] rounded-2xl border border-border-subtle bg-bg-surface-raised px-4 py-3 text-sm text-text-primary" textAlignVertical="top" />
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}
