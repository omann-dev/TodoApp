import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type DopamineBarProps = {
  points: number;
  goal: number;
};

export function DopamineBar({ points, goal }: DopamineBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const progress = goal === 0 ? 0 : Math.min(points / goal, 1);
  const progressPercent = Math.round(progress * 100);
  const isCompleted = points >= goal;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>Tägliche Dopamin-Dosis</Text>
          <Text style={styles.subtitle}>
            {points} / {goal} DP gesammelt
          </Text>
        </View>

        <View style={[styles.badge, isCompleted && styles.badgeCompleted]}>
          <Text style={styles.badgeText}>
            {isCompleted ? "VOLL" : `${progressPercent}%`}
          </Text>
        </View>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
      </View>

      <Text style={styles.footerText}>
        {isCompleted
          ? "Dosis erreicht. Stark gemacht."
          : "Hake Todos ab, um deine Leiste zu füllen."}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 20,
      marginBottom: 20,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 4,
    },
    badge: {
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
    },
    badgeCompleted: {
      backgroundColor: colors.reward,
      borderColor: colors.reward,
    },
    badgeText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0.8,
    },
    barBackground: {
      height: 16,
      backgroundColor: colors.surfaceLight,
      borderRadius: 999,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    barFill: {
      height: "100%",
      backgroundColor: colors.reward,
      borderRadius: 999,
    },
    footerText: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 10,
    },
  });
}