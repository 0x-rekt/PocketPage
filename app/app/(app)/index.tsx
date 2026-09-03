import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock data ────────────────────────────────────────────────────────────────

type IncidentSeverity = "critical" | "warning" | "success" | "muted";

interface Incident {
  id: string;
  title: string;
  source: string;
  severity: IncidentSeverity;
  status: "open" | "acked" | "resolved";
  time: string;
}

const RECENT_INCIDENTS: Incident[] = [
  {
    id: "1",
    title: "High error rate on /api/checkout",
    source: "Sentry",
    severity: "critical",
    status: "open",
    time: "2m ago",
  },
  {
    id: "2",
    title: "Uptime check failed — prod DB",
    source: "UptimeRobot",
    severity: "warning",
    status: "acked",
    time: "18m ago",
  },
  {
    id: "3",
    title: "Deployment #482 completed",
    source: "GitHub Actions",
    severity: "success",
    status: "resolved",
    time: "1h ago",
  },
];

const TEAM_ROTATION = [
  { name: "Alex K.", shift: "Next up · Thu", avatar: "A" },
  { name: "Priya M.", shift: "Fri – Mon", avatar: "P" },
];

// ─── On-call state ────────────────────────────────────────────────────────────

type OnCallState = "oncall" | "offcall" | "incident";

// Change to "oncall" or "offcall" to preview other states.
const DEMO_STATE: OnCallState = "incident";

function getStatusLabel(state: OnCallState) {
  if (state === "incident") return "1 ACTIVE\nINCIDENT";
  if (state === "oncall") return "ON CALL";
  return "ALL CLEAR";
}

function getStatusColor(state: OnCallState): string {
  if (state === "incident") return "#F5484B";
  if (state === "oncall") return "#5B6EF5";
  return "#3DD68C";
}

function getStatusSubtext(state: OnCallState) {
  if (state === "incident") return "Ack required · escalates in 8 min";
  if (state === "oncall") return "You're on call until Fri 09:00";
  return "No active incidents right now";
}

// ─── Pulsing border animation ─────────────────────────────────────────────────

function usePulseAnim(active: boolean) {
  const pulse = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    if (!active) {
      pulse.setValue(0.25);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.25,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  return pulse;
}

// ─── On-Call Status Card ──────────────────────────────────────────────────────

function OnCallStatusCard({ state }: { state: OnCallState }) {
  const pulse = usePulseAnim(state === "incident");
  const color = getStatusColor(state);
  const openCount = state === "incident" ? "1" : "0";

  return (
    <View className="relative">
      {state === "incident" && (
        <>
          {/* Static glow bleed behind the card for depth */}
          <View
            className="absolute rounded-[20px]"
            style={{
              top: 10,
              left: 10,
              right: 10,
              bottom: -8,
              backgroundColor: color,
              opacity: 0.12,
            }}
            pointerEvents="none"
          />
          {/* Pulsing border ring — uses top/left/right/bottom (not CSS inset) */}
          <Animated.View
            className="absolute rounded-[23px] border-2"
            style={{
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              borderColor: color,
              opacity: pulse,
            }}
            pointerEvents="none"
          />
        </>
      )}

      <Card>
        {/* §2.2 micro label — 11pt uppercase tracking */}
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-text-secondary">
          On-Call Status
        </Text>

        {/* §2.2 hero numeral — 40pt bold, severity color */}
        <Text
          className="mt-[14px] text-[40px] font-bold leading-[46px]"
          style={{ color }}
        >
          {getStatusLabel(state)}
        </Text>

        <Text className="mt-1.5 text-sm text-text-secondary">
          {getStatusSubtext(state)}
        </Text>

        {/* Sub-stats */}
        <View className="mt-5 flex-row items-center border-t border-border-subtle pt-4">
          <View className="flex-1">
            <Text className="text-[28px] font-bold text-text-primary">
              {openCount}
            </Text>
            <Text className="mt-0.5 text-xs text-text-secondary">
              open incidents
            </Text>
          </View>
          <View className="h-8 w-px bg-border-subtle" />
          <View className="flex-1 pl-5">
            <Text className="text-[28px] font-bold text-text-primary">3</Text>
            <Text className="mt-0.5 text-xs text-text-secondary">
              resolved this week
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

// ─── Incident Row ─────────────────────────────────────────────────────────────

function IncidentRow({ incident }: { incident: Incident }) {
  const statusLabel =
    incident.status === "open"
      ? "OPEN"
      : incident.status === "acked"
        ? "ACKED"
        : "RESOLVED";

  return (
    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}>
      <View className="flex-row items-center justify-between py-3.5">
        <View className="mr-3 flex-1">
          <Text
            className="text-[15px] font-semibold text-text-primary"
            numberOfLines={1}
          >
            {incident.title}
          </Text>
          <View className="mt-1 flex-row items-center gap-1.5">
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

// ─── Team Member Card ─────────────────────────────────────────────────────────

function TeamMemberCard({
  name,
  shift,
  avatar,
}: {
  name: string;
  shift: string;
  avatar: string;
}) {
  return (
    <Card className="flex-1">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-accent-primary/20">
        <Text className="text-sm font-bold text-accent-primary">{avatar}</Text>
      </View>
      <Text className="mt-3 text-base font-semibold text-text-primary">
        {name}
      </Text>
      <Text className="mt-0.5 text-xs text-text-secondary">{shift}</Text>
    </Card>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "there";
  const state: OnCallState = DEMO_STATE;
  const ctaLabel =
    state === "incident" ? "View Active Incident" : "Claim On-Call";

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header — §2.2: screen title 24pt bold */}
        <View className="flex-row items-center justify-between pb-6 pt-5">
          <View>
            <Text className="text-sm text-text-secondary">Good morning,</Text>
            <Text className="mt-0.5 text-2xl font-bold text-text-primary">
              {firstName}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Notifications"
            className="h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-surface"
          >
            <Ionicons name="notifications-outline" size={20} color="#9AA1B9" />
          </Pressable>
        </View>

        {/* On-Call Status card */}
        <OnCallStatusCard state={state} />

        {/* Primary CTA */}
        <PrimaryButton
          label={ctaLabel}
          className="mt-4"
          variant={state === "incident" ? "primary" : "secondary"}
          leftIcon={
            <Ionicons
              name={state === "incident" ? "flash" : "add-circle-outline"}
              size={18}
              color={state === "incident" ? "#fff" : "#F5F6FA"}
            />
          }
        />

        {/* Recent Incidents */}
        <SectionLabel className="mb-3 mt-8">Recent Incidents</SectionLabel>

        {RECENT_INCIDENTS.length === 0 ? (
          <View className="items-center rounded-2xl border border-dashed border-border-subtle px-5 py-10">
            <Ionicons
              name="checkmark-circle-outline"
              size={32}
              color="#3DD68C"
            />
            <Text className="mt-3 text-base font-semibold text-text-primary">
              You&apos;re all caught up
            </Text>
            <Text className="mt-1 text-center text-sm text-text-secondary">
              Incidents will appear here when your team receives a page.
            </Text>
          </View>
        ) : (
          <Card className="p-0 px-5">
            {RECENT_INCIDENTS.map((incident, i) => (
              <View key={incident.id}>
                <IncidentRow incident={incident} />
                {i < RECENT_INCIDENTS.length - 1 && (
                  <View className="h-px bg-border-subtle" />
                )}
              </View>
            ))}
          </Card>
        )}

        <Pressable className="mt-3 items-end active:opacity-70">
          <Text className="text-sm font-semibold text-accent-primary">
            View all →
          </Text>
        </Pressable>

        {/* Team Status */}
        <SectionLabel className="mb-3 mt-7">Team Status</SectionLabel>
        <View className="flex-row gap-3">
          {TEAM_ROTATION.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
