import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { apiGet, type DashboardData } from "@/lib/api";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule() {
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiGet("/api/me/dashboard", getToken)
      .then((result) => setData(result as DashboardData))
      .catch(() => setError(true));
  }, [getToken]);

  const rotation = data?.rotation;
  const current = rotation?.members[0];

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
        <View className="pb-6 pt-5">
          <Text className="text-2xl font-bold tracking-tight text-text-primary">Schedule</Text>
          <Text className="mt-1 text-[14px] text-text-secondary">{data?.team?.name ?? "Your on-call rotation"}</Text>
        </View>
        {error ? (
          <View className="mt-8 items-center">
            <Ionicons name="cloud-offline-outline" size={36} color="#F5A623" />
            <Text className="mt-3 text-base font-semibold text-text-primary">Couldn&apos;t load schedule</Text>
          </View>
        ) : !rotation ? (
          <View className="mt-8 items-center rounded-2xl border border-dashed border-border-subtle px-5 py-10">
            <Ionicons name="calendar-outline" size={36} color="#5B6EF5" />
            <Text className="mt-3 text-base font-semibold text-text-primary">No rotation configured</Text>
            <Text className="mt-1 text-center text-sm text-text-secondary">Finish team setup to create your first rotation.</Text>
          </View>
        ) : (
          <>
            <Card className="border-accent-primary/30 bg-accent-primary/10">
              <View className="flex-row items-center">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-accent-primary">
                  <Text className="text-lg font-bold text-white">{current?.name.charAt(0) ?? "?"}</Text>
                </View>
                <View className="flex-1">
                  <SectionLabel className="text-accent-primary">Current rotation</SectionLabel>
                  <Text className="mt-1 text-xl font-bold text-text-primary">{current?.name ?? "No one assigned"}</Text>
                  <Text className="mt-0.5 text-sm text-text-secondary">{rotation.name} · {rotation.cadence}</Text>
                </View>
                <Ionicons name="radio-button-on" size={14} color="#5B6EF5" />
              </View>
            </Card>
            <PrimaryButton label="Request Swap / Override" variant="secondary" className="mt-3" leftIcon={<Ionicons name="swap-horizontal" size={18} color="#F5F6FA" />} />
            <SectionLabel className="mb-3 mt-8">Rotation members</SectionLabel>
            <Card className="p-0 px-5">
              {rotation.members.map((member, index) => (
                <View key={member.id} className={`flex-row items-center py-3.5 ${index < rotation.members.length - 1 ? "border-b border-border-subtle" : ""}`}>
                  <View className={`h-9 w-9 items-center justify-center rounded-full ${member.isCurrent ? "bg-accent-primary" : "bg-bg-surface-raised"}`}>
                    <Text className={`text-sm font-bold ${member.isCurrent ? "text-white" : "text-text-secondary"}`}>{member.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-[15px] font-semibold text-text-primary">{member.name}</Text>
                    <Text className="mt-0.5 text-xs text-text-secondary">{member.email}</Text>
                  </View>
                  {member.isCurrent && <View className="rounded-full bg-accent-primary/20 px-2.5 py-0.5"><Text className="text-[11px] font-semibold text-accent-primary">NEXT</Text></View>}
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
