import { Stack } from "expo-router";
import { TypeColorProvider } from "@/context/TypeColorContext";

export default function RootLayout() {
  return (
    <TypeColorProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TypeColorProvider>
  )
}
