import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { CalendarDayDetailScreen } from "./src/screens/CalendarDayDetailScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { useTodos } from "./src/hooks/useTodos";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import { ThemeColors } from "./src/theme/theme";
import { AppSettingsProvider } from "./src/settings/AppSettingsContext";

type MainScreen = "home" | "calendar" | "stats";
type ActiveScreen = MainScreen | "settings" | "calendarDayDetail";

export default function App() {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <AppContent />
      </AppSettingsProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("home");
  const [lastMainScreen, setLastMainScreen] = useState<MainScreen>("home");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(
    null
  );

  const todosApi = useTodos();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  function openSettings() {
    if (activeScreen === "home" || activeScreen === "calendar" || activeScreen === "stats") {
      setLastMainScreen(activeScreen);
    }

    setActiveScreen("settings");
  }

  function closeSettings() {
    setActiveScreen(lastMainScreen);
  }

  function changeMainScreen(screen: MainScreen) {
    setLastMainScreen(screen);
    setActiveScreen(screen);
  }

  function openCalendarDay(dateKey: string) {
    setSelectedCalendarDate(dateKey);
    setActiveScreen("calendarDayDetail");
  }

  function closeCalendarDay() {
    setSelectedCalendarDate(null);
    setActiveScreen("calendar");
  }

  const shouldShowSettingsButton =
    activeScreen !== "settings" && activeScreen !== "calendarDayDetail";

  const shouldShowTabBar =
    activeScreen === "home" ||
    activeScreen === "calendar" ||
    activeScreen === "stats";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colors.statusBarStyle} />

      {shouldShowSettingsButton && (
        <Pressable style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.settingsButtonText}>⚙</Text>
        </Pressable>
      )}

      <View style={styles.screenContainer}>
        {activeScreen === "home" && <HomeScreen todosApi={todosApi} />}

        {activeScreen === "calendar" && (
          <CalendarScreen todosApi={todosApi} onOpenDay={openCalendarDay} />
        )}

        {activeScreen === "stats" && <StatsScreen todosApi={todosApi} />}

        {activeScreen === "settings" && (
          <SettingsScreen onClose={closeSettings} />
        )}

        {activeScreen === "calendarDayDetail" && selectedCalendarDate && (
          <CalendarDayDetailScreen
            dateKey={selectedCalendarDate}
            todosApi={todosApi}
            onBack={closeCalendarDay}
          />
        )}
      </View>

      {shouldShowTabBar && (
        <View style={styles.tabBar}>
          <TabButton
            label="Heute"
            isActive={activeScreen === "home"}
            onPress={() => changeMainScreen("home")}
          />

          <TabButton
            label="Kalender"
            isActive={activeScreen === "calendar"}
            onPress={() => changeMainScreen("calendar")}
          />

          <TabButton
            label="Stats"
            isActive={activeScreen === "stats"}
            onPress={() => changeMainScreen("stats")}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

function TabButton({ label, isActive, onPress }: TabButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenContainer: {
      flex: 1,
    },
    settingsButton: {
      position: "absolute",
      top: 54,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    settingsButtonText: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
      color: "#ffffff",
    },
  });
}