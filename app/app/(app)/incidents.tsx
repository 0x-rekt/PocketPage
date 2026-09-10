import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet, type DashboardData, type DashboardIncident } from "@/lib/api";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "ALL" | "OPEN" | "ACKED" | "RESOLVED";
const FILTERS: Filter[] = ["ALL", "OPEN", "ACKED", "RESOLVED"];

function IncidentRow({ incident }: { incident: DashboardIncident }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open incident: ${incident.title}`}
      onPress={() => router.push({ pathname: "/(app)/incident/[id]" as never, params: { id: incident.id } })}
      className="active:opacity-70"
    >
      <View className="flex-row items-center justify-between py-4">
        <View className="mr-3 flex-1">
          <Text className="text-[15px] font-semibold text-text-primary" numberOfLines={1}>{incident.title}</Text>
          <Text className="mt-1 text-xs text-text-secondary">{incident.source} · {new Date(incident.createdAt).toLocaleString()}</Text>
        </View>
        <StatusBadge severity={incident.severity} label={incident.status.toUpperCase()} />
      </View>
    </Pressable>
  );
}

export default function Incidents() {
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    apiGet("/api/me/dashboard", getToken)
      .then((result) => setData(result as DashboardData))
      .catch(() => setError(true));
  }, [getToken]);

  const filtered = useMemo(() => (data?.incidents ?? []).filter((incident) => {
    const matchesFilter = activeFilter === "ALL" || incident.status.toUpperCase() === activeFilter;
    const query = search.trim().toLowerCase();
    return matchesFilter && (!query || incident.title.toLowerCase().includes(query) || incident.source.toLowerCase().includes(query));
  }), [activeFilter, data, search]);

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="pb-6 pt-5">
          <Text className="text-2xl font-bold tracking-tight text-text-primary">Incidents</Text>
          <Text className="mt-1 text-[14px] text-text-secondary">{data?.team?.name ?? "Your team's incident history"}</Text>
        </View>
        <View className="mb-4 flex-row items-center rounded-2xl border border-border-subtle bg-bg-surface-raised px-4 py-3">
          <Ionicons name="search-outline" size={18} color="#9AA1B9" />
          <TextInput placeholder="Search incidents..." placeholderTextColor="#6B7280" value={search} onChangeText={setSearch} className="ml-3 flex-1 text-sm text-text-primary" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6" contentContainerClassName="gap-2">
          {FILTERS.map((filter) => (
            <Pressable key={filter} onPress={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 ${activeFilter === filter ? "bg-accent-primary" : "border border-border-subtle bg-bg-surface-raised"}`}>
              <Text className={`text-xs font-semibold ${activeFilter === filter ? "text-white" : "text-text-secondary"}`}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {error ? (
          <View className="mt-8 items-center">
            <Ionicons name="cloud-offline-outline" size={36} color="#F5A623" />
            <Text className="mt-3 text-base font-semibold text-text-primary">Couldn&apos;t load incidents</Text>
            <Text className="mt-1 text-center text-sm text-text-secondary">Check your connection and try again.</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="mt-8 items-center rounded-2xl border border-dashed border-border-subtle px-5 py-10">
            <Ionicons name="checkmark-circle-outline" size={36} color="#3DD68C" />
            <Text className="mt-3 text-base font-semibold text-text-primary">No incidents yet</Text>
            <Text className="mt-1 text-center text-sm text-text-secondary">New pages will appear here when your webhook receives an alert.</Text>
          </View>
        ) : (
          <View>
            <SectionLabel className="mb-3">Recent incidents</SectionLabel>
            <Card className="p-0 px-5">
              {filtered.map((incident, index) => (
                <View key={incident.id}>
                  <IncidentRow incident={incident} />
                  {index < filtered.length - 1 && <View className="h-px bg-border-subtle" />}
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
