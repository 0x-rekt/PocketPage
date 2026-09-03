import { useSSO } from "@clerk/expo";
import Constants from "expo-constants";
import * as AuthSession from "expo-auth-session";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_github",
  ) => {
    if (loadingStrategy) return;

    if (Constants.appOwnership === "expo") {
      Alert.alert(
        "Development build required",
        "Google and GitHub sign-in cannot finish in Expo Go. Run this app in an Expo development build instead.",
      );
      return;
    }

    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive, authSessionResult, signIn, signUp } =
        await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "pocket-page",
            path: "sso-callback",
          }),
        });

      if (authSessionResult?.type === "cancel") {
        return;
      }

      if (!createdSessionId) {
        if (signIn || signUp) {
          Alert.alert(
            "Sign-in needs another step",
            "Your Clerk account requires additional information before sign-in can finish.",
          );
        } else {
          Alert.alert(
            "Sign-in incomplete",
            "Clerk did not return a session. Check the OAuth redirect configuration and try again.",
          );
        }
        return;
      }

      if (!setActive) {
        Alert.alert(
          "Sign-in incomplete",
          "Clerk could not start the authentication session. Please try again.",
        );
        return;
      }

      await setActive({ session: createdSessionId });
    } catch (error) {
      console.log("Error in social auth:", error);
      Alert.alert("Error", "Failed to sign in. Please try again");
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
