import { ScrollView, StyleSheet, Text, View } from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { formatDisplayDate } from "../services/dateService";

type CalendarScreenProps = {
  todosApi: UseTodosResult;
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

export function CalendarScreen({ todosApi }: CalendarScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const groupedTodos = groupTodosByDate(todosApi.allTodos);
  const dates = Object.keys(groupedTodos).sort((a, b) => b.localeCompare(a));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Kalender</Text>
      <Text style={styles.subtitle}>
        Hier siehst du deine Aufgaben nach Tagen.
      </Text>

      {dates.length === 0 && (
        <Text style={styles.emptyText}>Noch keine gespeicherten Tage.</Text>
      )}

      {dates.map((date) => {
        const todos = groupedTodos[date];
        const completed = todos.filter((todo) => todo.isDone).length;

        return (
          <View key={date} style={styles.dayCard}>
            <Text style={styles.date}>{formatDisplayDate(date)}</Text>

            <Text style={styles.summary}>
              {completed} von {todos.length} erledigt
            </Text>

            {todos.map((todo) => (
              <Text
                key={todo.id}
                style={[styles.todoText, todo.isDone && styles.todoDone]}
              >
                {todo.isDone ? "✓" : "○"} {todo.title}
              </Text>
            ))}
          </View>
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
      fontWeight: "800",
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
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 14,
    },
    date: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 4,
    },
    summary: {
      color: colors.textMuted,
      marginBottom: 12,
    },
    todoText: {
      color: colors.text,
      fontSize: 15,
      marginBottom: 6,
    },
    todoDone: {
      color: colors.textDisabled,
      textDecorationLine: "line-through",
    },
  });
}