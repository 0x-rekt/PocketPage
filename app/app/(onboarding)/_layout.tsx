import { useAuth, useUser } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  if (!isLoaded || !userLoaded) return <LoadingScreen />;

  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  if (hasCompletedOnboarding(user?.unsafeMetadata)) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
