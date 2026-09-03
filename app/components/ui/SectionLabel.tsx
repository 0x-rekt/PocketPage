import React from "react";
import { Text, TextProps } from "react-native";

interface SectionLabelProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({
  children,
  className = "",
  ...props
}: SectionLabelProps) {
  return (
    <Text
      className={`text-xs font-semibold uppercase tracking-[2px] text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}
