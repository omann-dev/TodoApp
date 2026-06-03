import { StyleSheet, Text, View } from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type StatsScreenProps = {
  todosApi: UseTodosResult;
};

export function StatsScreen({ todosApi }: StatsScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const totalTodos = todosApi.allTodos.length;
  const completedTodos = todosApi.completedAllTodos;
  const openTodos = totalTodos - completedTodos;

  const completionRate =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistik</Text>
      <Text style={styles.subtitle}>Dein Fortschritt in Dopado.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Alle Aufgaben</Text>
        <Text style={styles.cardValue}>{totalTodos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Erledigt</Text>
        <Text style={styles.cardValue}>{completedTodos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Offen</Text>
        <Text style={styles.cardValue}>{openTodos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Erledigungsrate</Text>
        <Text style={styles.cardValue}>{completionRate}%</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: "800",
      marginTop: 20,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 16,
      marginTop: 6,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      borderRadius: 18,
      marginBottom: 14,
    },
    cardLabel: {
      color: colors.textMuted,
      fontSize: 15,
      marginBottom: 6,
    },
    cardValue: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "800",
    },
  });
}