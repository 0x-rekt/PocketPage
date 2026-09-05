import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Severity = "critical" | "warning" | "success" | "muted";

interface NotifPref {
  id: Severity;
  label: string;
  description: string;
  color: string;
  defaultOn: boolean;
}

const NOTIF_PREFS: NotifPref[] = [
  {
    id: "critical",
    label: "Critical",
    description: "Push + SMS + phone call",
    color: "#F5484B",
    defaultOn: true,
  },
  {
    id: "warning",
    label: "Warning",
    description: "Push notification",
    color: "#F5A623",
    defaultOn: true,
  },
  {
    id: "success",
    label: "Resolved",
    description: "Push notification",
    color: "#3DD68C",
    defaultOn: true,
  },
  {
    id: "muted",
    label: "Informational",
    description: "In-app only",
    color: "#6B7280",
    defaultOn: false,
  },
];

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingsRow({
  icon,
  label,
  subtitle,
  onPress,
  rightElement,
  destructive,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 active:opacity-60"
      disabled={!onPress && !rightElement}
    >
      <View className="mr-4">{icon}</View>
      <View className="flex-1">
        <Text
          className={`text-[15px] font-semibold ${destructive ? "text-status-critical" : "text-text-primary"}`}
        >
          {label}
        </Text>
        {subtitle && (
          <Text className="mt-0.5 text-xs text-text-secondary">{subtitle}</Text>
        )}
      </View>
      {rightElement ??
        (onPress && (
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        ))}
    </Pressable>
  );
}

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";

  const [prefs, setPrefs] = useState<Record<Severity, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((p) => [p.id, p.defaultOn])) as Record<
      Severity,
      boolean
    >,
  );

  const toggle = (id: Severity) =>
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));

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
            Profile
          </Text>
        </View>

        {/* Avatar + name card */}
        <Card>
          <View className="flex-row items-center">
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-accent-primary">
              <Text className="text-xl font-bold text-white">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-text-primary">
                {user?.fullName ?? "Your Name"}
              </Text>
              <Text className="mt-0.5 text-sm text-text-secondary">
                {user?.primaryEmailAddress?.emailAddress ?? ""}
              </Text>
            </View>
            <Pressable className="active:opacity-60">
              <Ionicons name="pencil-outline" size={18} color="#9AA1B9" />
            </Pressable>
          </View>
        </Card>

        {/* Notification preferences */}
        <SectionLabel className="mb-3 mt-8">
          Notification Preferences
        </SectionLabel>
        <Card className="p-0 px-5">
          {NOTIF_PREFS.map((pref, i) => (
            <View key={pref.id}>
              <View className="flex-row items-center py-3.5">
                <View
                  className="mr-3 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: pref.color }}
                />
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-text-primary">
                    {pref.label}
                  </Text>
                  <Text className="mt-0.5 text-xs text-text-secondary">
                    {pref.description}
                  </Text>
                </View>
                <Switch
                  value={prefs[pref.id]}
                  onValueChange={() => toggle(pref.id)}
                  trackColor={{ false: "#252B47", true: "#5B6EF5" }}
                  thumbColor="#F5F6FA"
                />
              </View>
              {i < NOTIF_PREFS.length - 1 && (
                <View className="h-px bg-border-subtle" />
              )}
            </View>
          ))}
        </Card>

        {/* Integrations */}
        <SectionLabel className="mb-3 mt-8">Integrations</SectionLabel>
        <Card className="p-0 px-5">
          <SettingsRow
            icon={<Ionicons name="link-outline" size={20} color="#9AA1B9" />}
            label="Webhook URL"
            subtitle="Sentry · UptimeRobot · Custom"
            onPress={() => {}}
          />
          <View className="h-px bg-border-subtle" />
          <SettingsRow
            icon={<Ionicons name="refresh-outline" size={20} color="#9AA1B9" />}
            label="Regenerate Token"
            subtitle="Last regenerated never"
            onPress={() => {}}
          />
        </Card>

        {/* Account */}
        <SectionLabel className="mb-3 mt-8">Account</SectionLabel>
        <Card className="p-0 px-5">
          <SettingsRow
            icon={<Ionicons name="people-outline" size={20} color="#9AA1B9" />}
            label="Team Members"
            onPress={() => {}}
          />
          <View className="h-px bg-border-subtle" />
          <SettingsRow
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#F5484B"
              />
            }
            label="Sign Out"
            destructive
            onPress={() => void signOut()}
          />
        </Card>

        <Text className="mt-8 text-center text-xs text-status-muted">
          PocketPage · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
