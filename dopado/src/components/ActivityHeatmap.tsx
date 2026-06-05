import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { getTodayDateKey } from "../services/dateService";
import { useI18n } from "../i18n/I18nContext";

type ActivityHeatmapProps = {
  todos: Todo[];
  dopaminePointsPerTodo: number;
  dailyDopamineGoal: number;
};

type DayActivity = {
  dateKey: string;
  completedTodos: number;
  dopaminePoints: number;
  goalReached: boolean;
};

const DAYS_TO_SHOW = 84;

export function ActivityHeatmap({
  todos,
  dopaminePointsPerTodo,
  dailyDopamineGoal,
}: ActivityHeatmapProps) {
  const { colors } = useTheme();
  const { t, language } = useI18n();
  const styles = createStyles(colors);

  const [selectedDateKey, setSelectedDateKey] = useState(getTodayDateKey());

  const heatmapPalette = getHeatmapPalette(colors);

  const days = useMemo(() => {
    return buildActivityDays(todos, dopaminePointsPerTodo, dailyDopamineGoal);
  }, [todos, dopaminePointsPerTodo, dailyDopamineGoal]);

  const weeks = useMemo(() => chunkIntoWeeks(days), [days]);

  const selectedDay =
    days.find((day) => day.dateKey === selectedDateKey) ??
    days[days.length - 1];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t("heatmap.title")}</Text>
          <Text style={styles.subtitle}>{t("heatmap.subtitle")}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gridScrollContent}
      >
        <View style={styles.gridWrapper}>
          <View style={styles.dayLabels}>
            <Text style={styles.dayLabel}>
              {language === "de" ? "Mo" : "Mon"}
            </Text>
            <Text style={styles.dayLabel}>
              {language === "de" ? "Mi" : "Wed"}
            </Text>
            <Text style={styles.dayLabel}>
              {language === "de" ? "Fr" : "Fri"}
            </Text>
          </View>

          <View style={styles.weeksContainer}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {week.map((day) => {
                  const isSelected = day.dateKey === selectedDateKey;

                  return (
                    <Pressable
                      key={day.dateKey}
                      style={[
                        styles.dayCell,
                        {
                          backgroundColor: getActivityColor(
                            day,
                            dailyDopamineGoal,
                            heatmapPalette
                          ),
                        },
                        isSelected && styles.dayCellSelected,
                      ]}
                      onPress={() => setSelectedDateKey(day.dateKey)}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.legendRow}>
        <Text style={styles.legendText}>{t("heatmap.less")}</Text>

        {heatmapPalette.map((color, index) => (
          <View
            key={`${color}-${index}`}
            style={[styles.legendCell, { backgroundColor: color }]}
          />
        ))}

        <Text style={styles.legendText}>{t("heatmap.more")}</Text>
      </View>

      <View style={styles.selectedCard}>
        <Text style={styles.selectedDate}>
          {formatDateKey(selectedDay.dateKey, language)}
        </Text>

        <Text style={styles.selectedText}>
          {t("heatmap.selected", {
            completed: selectedDay.completedTodos,
            points: selectedDay.dopaminePoints,
          })}
        </Text>

        <Text
          style={[
            styles.selectedStatus,
            selectedDay.goalReached
              ? styles.selectedStatusSuccess
              : styles.selectedStatusOpen,
          ]}
        >
          {selectedDay.goalReached
            ? t("heatmap.goalReached")
            : t("heatmap.goalOpen")}
        </Text>
      </View>
    </View>
  );
}

function getHeatmapPalette(colors: ThemeColors): string[] {
  return [
    colors.surfaceLight,
    colors.primaryDark,
    colors.primary,
    colors.secondary,
    colors.success,
    colors.reward,
  ];
}

function buildActivityDays(
  todos: Todo[],
  dopaminePointsPerTodo: number,
  dailyDopamineGoal: number
): DayActivity[] {
  const completedCountByDate: Record<string, number> = {};

  todos.forEach((todo) => {
    if (!todo.completedAt) {
      return;
    }

    const dateKey = getDateKeyFromTimestamp(todo.completedAt);
    completedCountByDate[dateKey] = (completedCountByDate[dateKey] ?? 0) + 1;
  });

  const today = new Date();
  const days: DayActivity[] = [];

  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateKey = getDateKeyFromDate(date);
    const completedTodos = completedCountByDate[dateKey] ?? 0;
    const dopaminePoints = completedTodos * dopaminePointsPerTodo;

    days.push({
      dateKey,
      completedTodos,
      dopaminePoints,
      goalReached: dopaminePoints >= dailyDopamineGoal,
    });
  }

  return days;
}

function chunkIntoWeeks(days: DayActivity[]): DayActivity[][] {
  const weeks: DayActivity[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

function getActivityColor(
  day: DayActivity,
  dailyDopamineGoal: number,
  heatmapPalette: string[]
): string {
  if (day.completedTodos === 0) {
    return heatmapPalette[0];
  }

  const progress =
    dailyDopamineGoal === 0 ? 0 : day.dopaminePoints / dailyDopamineGoal;

  if (progress < 0.2) {
    return heatmapPalette[1];
  }

  if (progress < 0.4) {
    return heatmapPalette[2];
  }

  if (progress < 0.6) {
    return heatmapPalette[3];
  }

  if (progress < 1) {
    return heatmapPalette[4];
  }

  return heatmapPalette[5];
}

function getDateKeyFromTimestamp(timestamp: string): string {
  return getDateKeyFromDate(new Date(timestamp));
}

function getDateKeyFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateKey(dateKey: string, language: "de" | "en"): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const locale = language === "de" ? "de-DE" : "en-US";

  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 16,
      marginBottom: 18,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "900",
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 4,
    },
    gridScrollContent: {
      paddingRight: 8,
    },
    gridWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    dayLabels: {
      height: 128,
      justifyContent: "space-around",
      marginRight: 8,
    },
    dayLabel: {
      color: colors.textDisabled,
      fontSize: 11,
      fontWeight: "700",
    },
    weeksContainer: {
      flexDirection: "row",
      gap: 5,
    },
    weekColumn: {
      gap: 5,
    },
    dayCell: {
      width: 14,
      height: 14,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
    dayCellSelected: {
      borderColor: colors.text,
      borderWidth: 2,
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 14,
      marginBottom: 14,
      justifyContent: "flex-end",
    },
    legendText: {
      color: colors.textDisabled,
      fontSize: 11,
      fontWeight: "700",
    },
    legendCell: {
      width: 13,
      height: 13,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
    selectedCard: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 14,
    },
    selectedDate: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "900",
      marginBottom: 5,
    },
    selectedText: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 8,
    },
    selectedStatus: {
      fontSize: 13,
      fontWeight: "900",
    },
    selectedStatusSuccess: {
      color: colors.success,
    },
    selectedStatusOpen: {
      color: colors.danger,
    },
  });
}