import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  leftIcon?: React.ReactNode;
}

export function PrimaryButton({
  label,
  loading = false,
  variant = "primary",
  leftIcon,
  disabled,
  className,
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  const containerClass =
    variant === "primary"
      ? "bg-accent-primary"
      : variant === "secondary"
        ? "border border-border-subtle bg-bg-surface-raised"
        : "border border-border-subtle bg-transparent";

  const textClass =
    variant === "primary" ? "text-white" : "text-text-primary";

  const indicatorColor = variant === "primary" ? "#fff" : "#F5F6FA";

  return (
    <Pressable
      className={`h-[54px] flex-row items-center justify-center rounded-[27px] ${containerClass} ${isDisabled ? "opacity-60" : ""} ${className ?? ""}`}
      style={({ pressed }) => ({ opacity: isDisabled ? 0.6 : pressed ? 0.78 : 1 })}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            className={`text-base font-semibold ${textClass} ${leftIcon ? "ml-2.5" : ""}`}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
