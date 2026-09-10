import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet, type DashboardData, type DashboardIncident } from "@/lib/api";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function usePulse(active: boolean) {
  const value = useRef(new Animated.Value(0.25)).current;
  useEffect(() => {
    if (!active) { value.setValue(0.25); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(value, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(value, { toValue: 0.25, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [active, value]);
  return value;
}

function IncidentRow({ incident }: { incident: DashboardIncident }) {
  return (
    <Pressable onPress={() => router.push({ pathname: "/(app)/incident/[id]" as never, params: { id: incident.id } })} className="active:opacity-70">
      <View className="flex-row items-center justify-between py-3.5">
        <View className="mr-3 flex-1">
          <Text className="text-[15px] font-semibold text-text-primary" numberOfLines={1}>{incident.title}</Text>
          <Text className="mt-1 text-xs text-text-secondary">{incident.source} · {new Date(incident.createdAt).toLocaleString()}</Text>
        </View>
        <StatusBadge severity={incident.severity} label={incident.status.toUpperCase()} />
      </View>
    </Pressable>
  );
}

function StatusCard({ data }: { data: DashboardData }) {
  const active = data.incidents.find((incident) => incident.status === "open");
  const hasRotation = Boolean(data.rotation?.members.length);
  const label = active ? "ACTIVE\nINCIDENT" : hasRotation ? "ON CALL" : "ALL CLEAR";
  const color = active ? "#F5484B" : hasRotation ? "#5B6EF5" : "#3DD68C";
  const pulse = usePulse(Boolean(active));

  return (
    <View className="relative">
      {active && <Animated.View className="absolute -inset-1 rounded-[23px] border-2" style={{ borderColor: color, opacity: pulse }} />}
      <Card>
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-text-secondary">On-Call Status</Text>
        <Text className="mt-[14px] text-[40px] font-bold leading-[46px]" style={{ color }}>{label}</Text>
        <Text className="mt-1.5 text-sm text-text-secondary">
          {active ? "Ack required · open incident" : hasRotation ? "Your rotation is active" : "No rotation has been configured"}
        </Text>
        <View className="mt-5 flex-row items-center border-t border-border-subtle pt-4">
          <View className="flex-1"><Text className="text-[28px] font-bold text-text-primary">{data.incidents.filter((incident) => incident.status === "open").length}</Text><Text className="mt-0.5 text-xs text-text-secondary">open incidents</Text></View>
          <View className="h-8 w-px bg-border-subtle" />
          <View className="flex-1 pl-5"><Text className="text-[28px] font-bold text-text-primary">{data.incidents.filter((incident) => incident.status === "resolved").length}</Text><Text className="mt-0.5 text-xs text-text-secondary">resolved incidents</Text></View>
        </View>
      </Card>
    </View>
  );
}

export default function Home() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiGet("/api/me/dashboard", getToken).then((result) => setData(result as DashboardData)).catch(() => setError(true));
  }, [getToken]);

  const active = useMemo(() => data?.incidents.find((incident) => incident.status === "open"), [data]);
  const recent = data?.incidents.slice(0, 3) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pb-6 pt-5">
          <View><Text className="text-sm text-text-secondary">Good morning,</Text><Text className="mt-0.5 text-2xl font-bold text-text-primary">{user?.firstName ?? "there"}</Text><Text className="mt-1 text-xs text-text-secondary">{data?.team?.name ?? "Your PocketPage"}</Text></View>
          <Pressable accessibilityLabel="Notifications" className="h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-surface"><Ionicons name="notifications-outline" size={20} color="#9AA1B9" /></Pressable>
        </View>

        {error ? <View className="mt-8 items-center"><Ionicons name="cloud-offline-outline" size={36} color="#F5A623" /><Text className="mt-3 text-base font-semibold text-text-primary">Couldn&apos;t load dashboard</Text><Text className="mt-1 text-sm text-text-secondary">Check your connection and try again.</Text></View> : !data ? <View className="py-16"><Text className="text-center text-sm text-text-secondary">Loading your dashboard…</Text></View> : <>
          <StatusCard data={data} />
          <PrimaryButton label={active ? "View Active Incident" : "View Schedule"} className="mt-4" variant="primary" leftIcon={<Ionicons name={active ? "flash" : "calendar-outline"} size={18} color="#FFFFFF" />} onPress={() => active ? router.push({ pathname: "/(app)/incident/[id]" as never, params: { id: active.id } }) : router.push("/(app)/schedule")} />
          <SectionLabel className="mb-3 mt-8">Recent Incidents</SectionLabel>
          {recent.length === 0 ? <View className="items-center rounded-2xl border border-dashed border-border-subtle px-5 py-10"><Ionicons name="checkmark-circle-outline" size={32} color="#3DD68C" /><Text className="mt-3 text-base font-semibold text-text-primary">You&apos;re all caught up</Text><Text className="mt-1 text-center text-sm text-text-secondary">Incidents will appear here when your webhook receives a page.</Text></View> : <Card className="p-0 px-5">{recent.map((incident, index) => <View key={incident.id}><IncidentRow incident={incident} />{index < recent.length - 1 && <View className="h-px bg-border-subtle" />}</View>)}</Card>}
          <Pressable className="mt-3 flex-row items-center justify-end" onPress={() => router.push("/(app)/incidents")}><Text className="text-sm font-semibold text-accent-primary">View all</Text><Ionicons name="arrow-forward" size={15} color="#5B6EF5" style={{ marginLeft: 5 }} /></Pressable>
          <SectionLabel className="mb-3 mt-7">Team Status</SectionLabel>
          {!data.rotation?.members.length ? <Card><Text className="text-sm text-text-secondary">No rotation members have been added yet.</Text></Card> : <View className="flex-row gap-3">{data.rotation.members.slice(0, 2).map((member) => <Card key={member.id} className="flex-1"><View className="h-10 w-10 items-center justify-center rounded-full bg-accent-primary/20"><Text className="text-sm font-bold text-accent-primary">{member.name.charAt(0)}</Text></View><Text className="mt-3 text-base font-semibold text-text-primary">{member.name}</Text><Text className="mt-0.5 text-xs text-text-secondary">{member.isCurrent ? "Current rotation" : "Upcoming"}</Text></Card>)}</View>}
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}
