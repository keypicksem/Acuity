import { Redirect } from "expo-router";

// Root index redirects into the tab navigator
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
