import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Todo } from "../types/todo";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useI18n } from "../i18n/I18nContext";

type TodoCardProps = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onOpen?: (todo: Todo) => void;
};

export function TodoCard({ todo, onToggle, onDelete, onOpen }: TodoCardProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  function handleContentPress() {
    if (onOpen) {
      onOpen(todo);
      return;
    }

    onToggle(todo);
  }

  function handleDeletePress() {
    Alert.alert(
      t("todoCard.deleteTitle"),
      t("todoCard.deleteMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => onDelete(todo.id),
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  return (
    <View style={styles.card}>
      <Pressable
        style={[styles.checkbox, todo.isDone && styles.checkboxDone]}
        onPress={() => onToggle(todo)}
      >
        {todo.isDone && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      <Pressable style={styles.content} onPress={handleContentPress}>
        <Text style={[styles.title, todo.isDone && styles.titleDone]}>
          {todo.title}
        </Text>

        {todo.description && todo.description.trim().length > 0 && (
          <Text style={styles.descriptionPreview} numberOfLines={1}>
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
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={handleDeletePress}>
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
      fontWeight: "900",
    },
    content: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    titleDone: {
      color: colors.textDisabled,
      textDecorationLine: "line-through",
    },
    descriptionPreview: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
      fontWeight: "600",
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
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    deleteText: {
      color: colors.textDisabled,
      fontSize: 26,
      fontWeight: "500",
    },
  });
}