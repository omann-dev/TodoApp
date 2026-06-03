import { Pressable, StyleSheet, Text, View } from "react-native";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type TodoCardProps = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <Pressable
        style={[styles.checkbox, todo.isDone && styles.checkboxDone]}
        onPress={() => onToggle(todo)}
      >
        {todo.isDone && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      <Pressable style={styles.content} onPress={() => onToggle(todo)}>
        <Text style={[styles.title, todo.isDone && styles.titleDone]}>
          {todo.title}
        </Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={() => onDelete(todo.id)}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 12,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    checkboxDone: {
      backgroundColor: colors.primary,
    },
    checkmark: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "800",
    },
    content: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    titleDone: {
      color: colors.textDisabled,
      textDecorationLine: "line-through",
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteText: {
      color: colors.textDisabled,
      fontSize: 26,
      fontWeight: "500",
    },
  });
}