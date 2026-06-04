import { ScrollView, StyleSheet, Text, View } from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useAppSettings } from "../settings/AppSettingsContext";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { StreakStatsCard } from "../components/StreakStatsCard";
import { useI18n } from "../i18n/I18nContext";

type StatsScreenProps = {
  todosApi: UseTodosResult;
};

export function StatsScreen({ todosApi }: StatsScreenProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  const { dailyDopamineGoal, dopaminePointsPerTodo } = useAppSettings();

  const totalTodos = todosApi.allTodos.length;
  const completedTodos = todosApi.completedAllTodos;
  const openTodos = totalTodos - completedTodos;

  const completionRate =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  const totalDopaminePoints = completedTodos * dopaminePointsPerTodo;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("stats.title")}</Text>
      <Text style={styles.subtitle}>{t("stats.subtitle")}</Text>

      <ActivityHeatmap
        todos={todosApi.allTodos}
        dopaminePointsPerTodo={dopaminePointsPerTodo}
        dailyDopamineGoal={dailyDopamineGoal}
      />

      <StreakStatsCard
        todos={todosApi.allTodos}
        dopaminePointsPerTodo={dopaminePointsPerTodo}
        dailyDopamineGoal={dailyDopamineGoal}
      />

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t("stats.allTasks")}</Text>
          <Text style={styles.cardValue}>{totalTodos}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t("stats.completed")}</Text>
          <Text style={styles.cardValue}>{completedTodos}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t("stats.open")}</Text>
          <Text style={styles.cardValue}>{openTodos}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t("stats.completionRate")}</Text>
          <Text style={styles.cardValue}>{completionRate}%</Text>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.cardLabel}>{t("stats.totalDp")}</Text>
          <Text style={styles.cardValue}>{totalDopaminePoints} DP</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 100,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: "900",
      marginTop: 20,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 16,
      marginTop: 6,
      marginBottom: 20,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    card: {
      width: "48%",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      borderRadius: 18,
    },
    cardWide: {
      width: "100%",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      borderRadius: 18,
    },
    cardLabel: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 6,
      fontWeight: "700",
    },
    cardValue: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "900",
    },
  });
}