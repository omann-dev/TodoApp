import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { formatDisplayDate } from "../services/dateService";
import { useAppSettings } from "../settings/AppSettingsContext";
import { useI18n } from "../i18n/I18nContext";

type CalendarScreenProps = {
  todosApi: UseTodosResult;
  onOpenDay: (dateKey: string) => void;
};

function groupTodosByDate(todos: Todo[]) {
  return todos.reduce<Record<string, Todo[]>>((groups, todo) => {
    if (!groups[todo.plannedFor]) {
      groups[todo.plannedFor] = [];
    }

    groups[todo.plannedFor].push(todo);
    return groups;
  }, {});
}

export function CalendarScreen({ todosApi, onOpenDay }: CalendarScreenProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  const { dailyDopamineGoal, dopaminePointsPerTodo } = useAppSettings();

  const groupedTodos = groupTodosByDate(todosApi.allTodos);
  const dates = Object.keys(groupedTodos).sort((a, b) => b.localeCompare(a));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("calendar.title")}</Text>
      <Text style={styles.subtitle}>{t("calendar.subtitle")}</Text>

      {dates.length === 0 && (
        <Text style={styles.emptyText}>{t("calendar.empty")}</Text>
      )}

      {dates.map((date) => {
        const todos = groupedTodos[date];
        const completed = todos.filter((todo) => todo.isDone).length;
        const dopaminePoints = completed * dopaminePointsPerTodo;
        const goalReached = dopaminePoints >= dailyDopamineGoal;
        const remainingPoints = Math.max(dailyDopamineGoal - dopaminePoints, 0);
        const progressPercent =
          dailyDopamineGoal === 0
            ? 0
            : Math.min(Math.round((dopaminePoints / dailyDopamineGoal) * 100), 100);

        return (
          <Pressable
            key={date}
            style={[
              styles.dayCard,
              goalReached ? styles.dayCardSuccess : styles.dayCardDanger,
            ]}
            onPress={() => onOpenDay(date)}
          >
            <View style={styles.dayHeader}>
              <View style={styles.dayTextContainer}>
                <Text style={styles.date}>{formatDisplayDate(date)}</Text>
                <Text style={styles.summary}>
                  {t("calendar.completedTodos", {
                    completed,
                    total: todos.length,
                  })}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {goalReached ? t("calendar.done") : t("calendar.open")}
                </Text>
              </View>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.pointsText}>
              {goalReached
                ? t("calendar.goalReached", {
                    points: dopaminePoints,
                    goal: dailyDopamineGoal,
                  })
                : t("calendar.goalOpen", {
                    points: dopaminePoints,
                    goal: dailyDopamineGoal,
                    remaining: remainingPoints,
                  })}
            </Text>
          </Pressable>
        );
      })}
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
    emptyText: {
      color: colors.textDisabled,
      textAlign: "center",
      marginTop: 40,
      fontSize: 15,
    },
    dayCard: {
      padding: 16,
      borderRadius: 22,
      marginBottom: 14,
    },
    dayCardSuccess: {
      backgroundColor: colors.success,
    },
    dayCardDanger: {
      backgroundColor: colors.danger,
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 14,
    },
    dayTextContainer: {
      flex: 1,
    },
    date: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 4,
    },
    summary: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "700",
      opacity: 0.9,
    },
    statusBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.22)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    statusBadgeText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 0.8,
    },
    progressBackground: {
      height: 10,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: 10,
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#ffffff",
      borderRadius: 999,
    },
    pointsText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "700",
      opacity: 0.95,
    },
  });
}