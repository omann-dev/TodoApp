import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { useTodos } from "./src/hooks/useTodos";
import { colors } from "./src/constants/colors";

type ActiveScreen = "home" | "calendar" | "stats";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("home");
  const todosApi = useTodos();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.screenContainer}>
        {activeScreen === "home" && <HomeScreen todosApi={todosApi} />}
        {activeScreen === "calendar" && <CalendarScreen todosApi={todosApi} />}
        {activeScreen === "stats" && <StatsScreen todosApi={todosApi} />}
      </View>

      <View style={styles.tabBar}>
        <TabButton
          label="Heute"
          isActive={activeScreen === "home"}
          onPress={() => setActiveScreen("home")}
        />

        <TabButton
          label="Kalender"
          isActive={activeScreen === "calendar"}
          onPress={() => setActiveScreen("calendar")}
        />

        <TabButton
          label="Stats"
          isActive={activeScreen === "stats"}
          onPress={() => setActiveScreen("stats")}
        />
      </View>
    </SafeAreaView>
  );
}

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

function TabButton({ label, isActive, onPress }: TabButtonProps) {
  return (
    <Pressable
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    padding: 10,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.text,
  },
});