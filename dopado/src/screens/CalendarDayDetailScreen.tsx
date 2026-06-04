import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useAppSettings } from "../settings/AppSettingsContext";
import { formatDisplayDate } from "../services/dateService";
import { DopamineBar } from "../components/DopamineBar";
import { useI18n } from "../i18n/I18nContext";

type CalendarDayDetailScreenProps = {
  dateKey: string;
  todosApi: UseTodosResult;
  onBack: () => void;
};

export function CalendarDayDetailScreen({
  dateKey,
  todosApi,
  onBack,
}: CalendarDayDetailScreenProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  const { dailyDopamineGoal, dopaminePointsPerTodo } = useAppSettings();

  const todosForDay = todosApi.allTodos.filter(
    (todo) => todo.plannedFor === dateKey
  );

  const completedTodos = todosForDay.filter((todo) => todo.isDone).length;
  const openTodos = todosForDay.length - completedTodos;

  const dopaminePoints = completedTodos * dopaminePointsPerTodo;
  const goalReached = dopaminePoints >= dailyDopamineGoal;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{formatDisplayDate(dateKey)}</Text>
          <Text style={styles.subtitle}>{t("calendarDetail.title")}</Text>
        </View>
      </View>

      <View
        style={[
          styles.statusCard,
          goalReached ? styles.statusCardSuccess : styles.statusCardDanger,
        ]}
      >
        <Text style={styles.statusTitle}>
          {goalReached
            ? t("calendarDetail.goalReached")
            : t("calendarDetail.goalNotReached")}
        </Text>

        <Text style={styles.statusText}>
          {t("calendarDetail.points", {
            points: dopaminePoints,
            goal: dailyDopamineGoal,
          })}
        </Text>
      </View>

      <DopamineBar points={dopaminePoints} goal={dailyDopamineGoal} />

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{todosForDay.length}</Text>
          <Text style={styles.summaryLabel}>{t("calendarDetail.todos")}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{completedTodos}</Text>
          <Text style={styles.summaryLabel}>
            {t("calendarDetail.completed")}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{openTodos}</Text>
          <Text style={styles.summaryLabel}>{t("calendarDetail.open")}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t("calendarDetail.tasks")}</Text>

      {todosForDay.length === 0 ? (
        <Text style={styles.emptyText}>{t("calendarDetail.empty")}</Text>
      ) : (
        todosForDay.map((todo) => (
          <ReadOnlyTodoCard
            key={todo.id}
            todo={todo}
            dopaminePointsPerTodo={dopaminePointsPerTodo}
          />
        ))
      )}
    </ScrollView>
  );
}

type ReadOnlyTodoCardProps = {
  todo: Todo;
  dopaminePointsPerTodo: number;
};

function ReadOnlyTodoCard({
  todo,
  dopaminePointsPerTodo,
}: ReadOnlyTodoCardProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  return (
    <View style={styles.todoCard}>
      <View style={[styles.statusDot, todo.isDone && styles.statusDotDone]}>
        <Text style={styles.statusDotText}>{todo.isDone ? "✓" : "○"}</Text>
      </View>

      <View style={styles.todoContent}>
        <Text style={[styles.todoTitle, todo.isDone && styles.todoTitleDone]}>
          {todo.title}
        </Text>

        {todo.description && todo.description.trim().length > 0 && (
          <Text style={styles.todoDescription} numberOfLines={2}>
            {todo.description}
          </Text>
        )}

        {todo.categoryName && (
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: todo.categoryColor ?? colors.primary },
              ]}
            />
            <Text style={styles.categoryText}>{todo.categoryName}</Text>
          </View>
        )}

        <Text style={styles.todoMeta}>
          {todo.isDone
            ? t("calendarDetail.todoDone", { points: dopaminePointsPerTodo })
            : t("calendarDetail.todoOpen")}
        </Text>

        {todo.completedAt && (
          <Text style={styles.todoMetaSmall}>
            {t("calendarDetail.completedAt", {
              date: formatDateTime(todo.completedAt),
            })}
          </Text>
        )}
      </View>
    </View>
  );
}

function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 20,
      marginBottom: 20,
    },
    headerTextContainer: {
      flex: 1,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    backButtonText: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "700",
      marginTop: -2,
    },
    title: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "900",
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 15,
      marginTop: 4,
    },
    statusCard: {
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
    },
    statusCardSuccess: {
      backgroundColor: colors.success,
    },
    statusCardDanger: {
      backgroundColor: colors.danger,
    },
    statusTitle: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 4,
    },
    statusText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "700",
      opacity: 0.9,
    },
    summaryGrid: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 22,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 14,
      alignItems: "center",
    },
    summaryValue: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "900",
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
      fontWeight: "700",
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 12,
      marginTop: 4,
    },
    emptyText: {
      color: colors.textDisabled,
      textAlign: "center",
      marginTop: 40,
      fontSize: 15,
    },
    todoCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 12,
      gap: 14,
    },
    statusDot: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    statusDotDone: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    statusDotText: {
      color: "#ffffff",
      fontSize: 17,
      fontWeight: "900",
    },
    todoContent: {
      flex: 1,
    },
    todoTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    todoTitleDone: {
      color: colors.text,
    },
    todoDescription: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 5,
      lineHeight: 18,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 7,
    },
    categoryDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },
    categoryText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: "800",
    },
    todoMeta: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 5,
      fontWeight: "600",
    },
    todoMetaSmall: {
      color: colors.textDisabled,
      fontSize: 12,
      marginTop: 4,
    },
  });
}