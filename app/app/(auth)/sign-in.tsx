import useSocialAuth from "@/hooks/useSocialAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();
  useWarmUpBrowser();

  const glowA = useRef(new Animated.Value(0.18)).current;
  const glowB = useRef(new Animated.Value(0.08)).current;

  useEffect(() => {
    const pulse = (val: Animated.Value, lo: number, hi: number, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: hi,
            duration: dur,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: lo,
            duration: dur,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

    pulse(glowA, 0.18, 0.4, 2400).start();
    pulse(glowB, 0.06, 0.2, 3200).start();
  }, [glowA, glowB]);

  const isLoading = Boolean(loadingStrategy);

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-1 justify-end overflow-hidden">
        <Animated.View
          className="absolute rounded-full bg-accent-primary"
          style={{
            width: 420,
            height: 420,
            top: -180,
            left: -80,
            opacity: glowA,
          }}
          pointerEvents="none"
        />
        <Animated.View
          className="absolute rounded-full bg-accent-primary"
          style={{
            width: 280,
            height: 280,
            top: -60,
            right: -100,
            opacity: glowB,
          }}
          pointerEvents="none"
        />
        {/* Orb 3 — small accent, mid-center */}
        <Animated.View
          className="absolute rounded-full bg-accent-primary"
          style={{
            width: 160,
            height: 160,
            top: 100,
            left: 100,
            opacity: glowA,
          }}
          pointerEvents="none"
        />

        {/* Text content — normal flow, sits at the bottom of the hero */}
        <View className="px-7 pb-9">
          <View className="mb-6 h-[60px] w-[60px] items-center justify-center rounded-[18px] border border-white/15 bg-accent-primary">
            <Ionicons name="pulse" size={30} color="#fff" />
          </View>
          <Text className="text-[40px] font-bold leading-[48px] text-text-primary">
            Never miss{"\n"}a page again.
          </Text>
          <Text className="mt-3 max-w-[300px] text-[15px] leading-[23px] text-text-secondary">
            Reliable on-call management for small engineering teams.
          </Text>
        </View>
      </View>

      <View className="border-t border-border-subtle px-6 pb-6 pt-7">
        <Text className="mb-[14px] text-[11px] font-semibold uppercase tracking-[1.5px] text-text-secondary">
          Continue with
        </Text>

        <Pressable
          accessibilityLabel="Sign in with Google"
          className={`mb-3 h-[54px] flex-row items-center justify-center rounded-[28px] bg-text-primary ${isLoading ? "opacity-60" : ""}`}
          disabled={isLoading}
          onPress={() => void handleSocialAuth("oauth_google")}
        >
          {loadingStrategy === "oauth_google" ? (
            <ActivityIndicator color="#0B0E1A" />
          ) : (
            <AntDesign name="google" size={20} color="#0B0E1A" />
          )}
          <Text className="ml-2.5 text-base font-semibold text-bg-primary">
            Google
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Sign in with GitHub"
          className={`mb-3 h-[54px] flex-row items-center justify-center rounded-[28px] border border-border-subtle bg-bg-surface ${isLoading ? "opacity-60" : ""}`}
          disabled={isLoading}
          onPress={() => void handleSocialAuth("oauth_github")}
        >
          {loadingStrategy === "oauth_github" ? (
            <ActivityIndicator color="#F5F6FA" />
          ) : (
            <AntDesign name="github" size={20} color="#F5F6FA" />
          )}
          <Text className="ml-2.5 text-base font-semibold text-text-primary">
            GitHub
          </Text>
        </Pressable>

        <Text className="mt-1.5 text-center text-xs leading-[18px] text-status-muted">
          By continuing you agree to PocketPage&apos;s terms of service.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
