import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View
      className={`rounded-[20px] border border-border-subtle bg-bg-surface p-5 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
