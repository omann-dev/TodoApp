import { StyleSheet, Text, View } from "react-native";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useI18n } from "../i18n/I18nContext";

type StreakStatsCardProps = {
  todos: Todo[];
  dopaminePointsPerTodo: number;
  dailyDopamineGoal: number;
};

type StreakStats = {
  currentStreak: number;
  bestStreak: number;
  reachedThisWeek: number;
};

export function StreakStatsCard({
  todos,
  dopaminePointsPerTodo,
  dailyDopamineGoal,
}: StreakStatsCardProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  const stats = calculateStreakStats(
    todos,
    dopaminePointsPerTodo,
    dailyDopamineGoal
  );

  const hasActiveStreak = stats.currentStreak > 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("streak.title")}</Text>
          <Text style={styles.subtitle}>{t("streak.subtitle")}</Text>
        </View>

        <View
          style={[
            styles.flameBadge,
            hasActiveStreak ? styles.flameBadgeActive : styles.flameBadgeInactive,
          ]}
        >
          <Text style={styles.flameIcon}>🔥</Text>
        </View>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageText}>
          {hasActiveStreak
            ? t("streak.activeMessage")
            : t("streak.inactiveMessage")}
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statBox, styles.highlightBox]}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>
            {t("streak.days", { count: stats.currentStreak })}
          </Text>
          <Text style={styles.statLabel}>{t("streak.current")}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🏆</Text>
          <Text style={styles.statValue}>
            {t("streak.days", { count: stats.bestStreak })}
          </Text>
          <Text style={styles.statLabel}>{t("streak.best")}</Text>
        </View>

        <View style={styles.statBoxWide}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>
            {t("streak.weekValue", { count: stats.reachedThisWeek })}
          </Text>
          <Text style={styles.statLabel}>{t("streak.week")}</Text>
        </View>
      </View>
    </View>
  );
}

function calculateStreakStats(
  todos: Todo[],
  dopaminePointsPerTodo: number,
  dailyDopamineGoal: number
): StreakStats {
  const completedCountByDate: Record<string, number> = {};

  todos.forEach((todo) => {
    if (!todo.completedAt) {
      return;
    }

    const dateKey = getDateKeyFromDate(new Date(todo.completedAt));
    completedCountByDate[dateKey] = (completedCountByDate[dateKey] ?? 0) + 1;
  });

  const goalReachedByDate: Record<string, boolean> = {};

  Object.entries(completedCountByDate).forEach(([dateKey, completedCount]) => {
    const dopaminePoints = completedCount * dopaminePointsPerTodo;
    goalReachedByDate[dateKey] = dopaminePoints >= dailyDopamineGoal;
  });

  const today = new Date();

  let currentStreak = 0;

  for (let offset = 0; offset < 365; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const dateKey = getDateKeyFromDate(date);

    if (!goalReachedByDate[dateKey]) {
      break;
    }

    currentStreak++;
  }

  let bestStreak = 0;
  let runningStreak = 0;

  for (let offset = 364; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const dateKey = getDateKeyFromDate(date);

    if (goalReachedByDate[dateKey]) {
      runningStreak++;
      bestStreak = Math.max(bestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }

  let reachedThisWeek = 0;

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const dateKey = getDateKeyFromDate(date);

    if (goalReachedByDate[dateKey]) {
      reachedThisWeek++;
    }
  }

  return {
    currentStreak,
    bestStreak,
    reachedThisWeek,
  };
}

function getDateKeyFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      padding: 16,
      marginBottom: 18,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    titleContainer: {
      flex: 1,
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
      lineHeight: 19,
    },
    flameBadge: {
      width: 54,
      height: 54,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },
    flameBadgeActive: {
      backgroundColor: colors.reward,
      borderColor: colors.reward,
    },
    flameBadgeInactive: {
      backgroundColor: colors.surfaceLight,
      borderColor: colors.border,
      opacity: 0.75,
    },
    flameIcon: {
      fontSize: 27,
    },
    messageCard: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 13,
      marginBottom: 14,
    },
    messageText: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "800",
      lineHeight: 18,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    statBox: {
      flex: 1,
      minWidth: "47%",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 14,
    },
    highlightBox: {
      borderColor: colors.reward,
    },
    statBoxWide: {
      width: "100%",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 14,
    },
    statIcon: {
      fontSize: 22,
      marginBottom: 6,
    },
    statValue: {
      color: colors.reward,
      fontSize: 24,
      fontWeight: "900",
      marginBottom: 4,
    },
    statLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "800",
    },
  });
}