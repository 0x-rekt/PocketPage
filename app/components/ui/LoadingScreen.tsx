import { ActivityIndicator, Text, View } from "react-native";

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-primary">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent-primary">
        <Text className="text-xl font-bold text-white">P</Text>
      </View>
      <ActivityIndicator className="mt-5" color="#5B6EF5" />
    </View>
  );
}
