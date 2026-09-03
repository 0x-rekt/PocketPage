import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "ALL" | "OPEN" | "ACKED" | "RESOLVED";
type Severity = "critical" | "warning" | "success" | "muted";
type Status = "open" | "acked" | "resolved";

interface Incident {
  id: string;
  title: string;
  source: string;
  severity: Severity;
  status: Status;
  time: string;
  date: string;
}

const ALL_INCIDENTS: Incident[] = [
  {
    id: "1",
    title: "High error rate on /api/checkout",
    source: "Sentry",
    severity: "critical",
    status: "open",
    time: "2m ago",
    date: "Today",
  },
  {
    id: "2",
    title: "Uptime check failed — prod DB",
    source: "UptimeRobot",
    severity: "warning",
    status: "acked",
    time: "18m ago",
    date: "Today",
  },
  {
    id: "3",
    title: "High memory usage on worker-3",
    source: "Grafana",
    severity: "warning",
    status: "open",
    time: "42m ago",
    date: "Today",
  },
  {
    id: "4",
    title: "Deployment #482 completed",
    source: "GitHub Actions",
    severity: "success",
    status: "resolved",
    time: "1h ago",
    date: "Today",
  },
  {
    id: "5",
    title: "Auth service latency spike",
    source: "Sentry",
    severity: "critical",
    status: "resolved",
    time: "6h ago",
    date: "Yesterday",
  },
  {
    id: "6",
    title: "SSL cert expiry warning",
    source: "UptimeRobot",
    severity: "muted",
    status: "resolved",
    time: "1d ago",
    date: "Yesterday",
  },
];

const FILTERS: Filter[] = ["ALL", "OPEN", "ACKED", "RESOLVED"];

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${active ? "bg-accent-primary" : "border border-border-subtle bg-bg-surface-raised"}`}
    >
      <Text
        className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const statusLabel =
    incident.status === "open"
      ? "OPEN"
      : incident.status === "acked"
        ? "ACKED"
        : "RESOLVED";

  return (
    <Pressable className="active:opacity-70">
      <View className="flex-row items-center justify-between py-4">
        <View className="mr-3 flex-1">
          <Text
            className="text-[15px] font-semibold text-text-primary"
            numberOfLines={1}
          >
            {incident.title}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-xs text-text-secondary">
              {incident.source}
            </Text>
            <Text className="text-xs text-border-subtle">·</Text>
            <Text className="text-xs text-text-secondary">{incident.time}</Text>
          </View>
        </View>
        <StatusBadge severity={incident.severity} label={statusLabel} />
      </View>
    </Pressable>
  );
}

export default function Incidents() {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");

  const filtered = ALL_INCIDENTS.filter((inc) => {
    const matchFilter =
      activeFilter === "ALL" ||
      inc.status.toUpperCase() === activeFilter;
    const matchSearch =
      search === "" ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.source.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, Incident[]>>((acc, inc) => {
    if (!acc[inc.date]) acc[inc.date] = [];
    acc[inc.date].push(inc);
    return acc;
  }, {});

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
            Incidents
          </Text>
          <Text className="mt-1 text-[14px] text-text-secondary">
            Your team&apos;s full incident history
          </Text>
        </View>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-2xl border border-border-subtle bg-bg-surface-raised px-4 py-3">
          <Ionicons name="search-outline" size={18} color="#9AA1B9" />
          <TextInput
            placeholder="Search incidents..."
            placeholderTextColor="#6B7280"
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1 text-sm text-text-primary"
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="gap-2"
        >
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              label={f}
              active={activeFilter === f}
              onPress={() => setActiveFilter(f)}
            />
          ))}
        </ScrollView>

        {/* Grouped incident list */}
        {Object.keys(grouped).length === 0 ? (
          <View className="mt-8 items-center">
            <Ionicons
              name="checkmark-circle-outline"
              size={36}
              color="#3DD68C"
            />
            <Text className="mt-3 text-base font-semibold text-text-primary">
              No incidents found
            </Text>
            <Text className="mt-1 text-sm text-text-secondary">
              Try adjusting your filters or search term.
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([date, incidents]) => (
            <View key={date} className="mb-4">
              <SectionLabel className="mb-3">{date}</SectionLabel>
              <Card className="p-0 px-5">
                {incidents.map((inc, i) => (
                  <View key={inc.id}>
                    <IncidentRow incident={inc} />
                    {i < incidents.length - 1 && (
                      <View className="h-px bg-border-subtle" />
                    )}
                  </View>
                ))}
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
