import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { CalendarDayDetailScreen } from "./src/screens/CalendarDayDetailScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { StartupScreen } from "./src/screens/StartupScreen";
import { CreateTodoScreen } from "./src/screens/CreateTodoScreen";
import { TodoDetailScreen } from "./src/screens/TodoDetailScreen";
import { EditTodoScreen } from "./src/screens/EditTodoScreen";
import { useTodos } from "./src/hooks/useTodos";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import { ThemeColors } from "./src/theme/theme";
import {
  AppSettingsProvider,
  useAppSettings,
} from "./src/settings/AppSettingsContext";
import { I18nProvider, useI18n } from "./src/i18n/I18nContext";
import { Todo } from "./src/types/todo";

type MainScreen = "home" | "calendar" | "stats";

type ActiveScreen =
  | MainScreen
  | "settings"
  | "calendarDayDetail"
  | "createTodo"
  | "todoDetail"
  | "editTodo";

const STARTUP_SCREEN_DURATION_IN_MS = 2200;

export default function App() {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <I18nProvider>
          <AppContent />
        </I18nProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("home");
  const [lastMainScreen, setLastMainScreen] = useState<MainScreen>("home");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | null
  >(null);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [hasStartupTimePassed, setHasStartupTimePassed] = useState(false);

  const todosApi = useTodos();
  const { isSettingsLoading } = useAppSettings();
  const { t, isLanguageLoading } = useI18n();

  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStartupTimePassed(true);
    }, STARTUP_SCREEN_DURATION_IN_MS);

    return () => clearTimeout(timer);
  }, []);

  const shouldShowStartupScreen =
    !hasStartupTimePassed ||
    todosApi.isLoading ||
    isSettingsLoading ||
    isLanguageLoading;

  if (shouldShowStartupScreen) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={colors.statusBarStyle} />
        <StartupScreen />
      </SafeAreaView>
    );
  }

  function openSettings() {
    if (
      activeScreen === "home" ||
      activeScreen === "calendar" ||
      activeScreen === "stats"
    ) {
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

  function openCreateTodo() {
    setLastMainScreen("home");
    setActiveScreen("createTodo");
  }

  function closeCreateTodo() {
    setActiveScreen("home");
  }

  function handleTodoCreated() {
    setActiveScreen("home");
  }

  function openTodoDetail(todo: Todo) {
    setSelectedTodoId(todo.id);
    setActiveScreen("todoDetail");
  }

  function closeTodoDetail() {
    setSelectedTodoId(null);
    setActiveScreen("home");
  }

  function openEditTodo(todoId: string) {
    setSelectedTodoId(todoId);
    setActiveScreen("editTodo");
  }

  function closeEditTodo() {
    if (selectedTodoId) {
      setActiveScreen("todoDetail");
      return;
    }

    setActiveScreen("home");
  }

  function handleTodoUpdated() {
    setActiveScreen("todoDetail");
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
    activeScreen !== "settings" &&
    activeScreen !== "calendarDayDetail" &&
    activeScreen !== "createTodo" &&
    activeScreen !== "todoDetail" &&
    activeScreen !== "editTodo";

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
        {activeScreen === "home" && (
          <HomeScreen
            todosApi={todosApi}
            onOpenCreateTodo={openCreateTodo}
            onOpenTodo={openTodoDetail}
          />
        )}

        {activeScreen === "calendar" && (
          <CalendarScreen todosApi={todosApi} onOpenDay={openCalendarDay} />
        )}

        {activeScreen === "stats" && <StatsScreen todosApi={todosApi} />}

        {activeScreen === "settings" && (
          <SettingsScreen onClose={closeSettings} />
        )}

        {activeScreen === "createTodo" && (
          <CreateTodoScreen
            todosApi={todosApi}
            onBack={closeCreateTodo}
            onCreated={handleTodoCreated}
          />
        )}

        {activeScreen === "todoDetail" && selectedTodoId && (
          <TodoDetailScreen
            todoId={selectedTodoId}
            todosApi={todosApi}
            onBack={closeTodoDetail}
            onEdit={openEditTodo}
          />
        )}

        {activeScreen === "editTodo" && selectedTodoId && (
          <EditTodoScreen
            todoId={selectedTodoId}
            todosApi={todosApi}
            onBack={closeEditTodo}
            onUpdated={handleTodoUpdated}
          />
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
            label={t("tabs.today")}
            isActive={activeScreen === "home"}
            onPress={() => changeMainScreen("home")}
          />

          <TabButton
            label={t("tabs.calendar")}
            isActive={activeScreen === "calendar"}
            onPress={() => changeMainScreen("calendar")}
          />

          <TabButton
            label={t("tabs.stats")}
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