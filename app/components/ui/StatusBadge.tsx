import React from "react";
import { Text, View } from "react-native";

type Severity = "critical" | "warning" | "success" | "muted";

interface StatusBadgeProps {
  severity: Severity;
  label: string;
}

const config: Record<
  Severity,
  { containerClass: string; textClass: string }
> = {
  critical: {
    containerClass: "bg-status-critical/20 border border-status-critical/40",
    textClass: "text-status-critical",
  },
  warning: {
    containerClass: "bg-status-warning/20 border border-status-warning/40",
    textClass: "text-status-warning",
  },
  success: {
    containerClass: "bg-status-success/20 border border-status-success/40",
    textClass: "text-status-success",
  },
  muted: {
    containerClass: "bg-status-muted/20 border border-status-muted/40",
    textClass: "text-status-muted",
  },
};

export function StatusBadge({ severity, label }: StatusBadgeProps) {
  const { containerClass, textClass } = config[severity];
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${containerClass}`}>
      <Text className={`text-[11px] font-semibold ${textClass}`}>{label}</Text>
    </View>
  );
}
