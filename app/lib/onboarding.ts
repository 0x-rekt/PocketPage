export const ONBOARDING_METADATA_KEY = "pocketPageOnboarding";

export function hasCompletedOnboarding(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object") return false;

  const onboarding = (metadata as Record<string, unknown>)[ONBOARDING_METADATA_KEY];
  return (
    typeof onboarding === "object" &&
    onboarding !== null &&
    (onboarding as Record<string, unknown>).completed === true
  );
}
