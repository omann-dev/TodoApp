import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TodoCard } from "../components/TodoCard";
import { DopamineBar } from "../components/DopamineBar";
import { UseTodosResult } from "../hooks/useTodos";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useAppSettings } from "../settings/AppSettingsContext";
import { BrandText } from "../components/BrandText";
import { Todo } from "../types/todo";
import { useI18n } from "../i18n/I18nContext";

type HomeScreenProps = {
  todosApi: UseTodosResult;
  onOpenCreateTodo: () => void;
  onOpenTodo: (todo: Todo) => void;
};

export function HomeScreen({
  todosApi,
  onOpenCreateTodo,
  onOpenTodo,
}: HomeScreenProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  const { dailyDopamineGoal, dopaminePointsPerTodo } = useAppSettings();

  const dopaminePoints = todosApi.completedTodayTodos * dopaminePointsPerTodo;

  return (
    <FlatList
      style={styles.container}
      data={todosApi.todayTodos}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <BrandText size={42} />
            <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
          </View>

          <DopamineBar points={dopaminePoints} goal={dailyDopamineGoal} />

          <Pressable style={styles.createButton} onPress={onOpenCreateTodo}>
            <Text style={styles.createButtonText}>{t("home.createTodo")}</Text>
          </Pressable>

          <View style={styles.progressCard}>
            <Text style={styles.progressText}>
              {t("home.progress", {
                completed: todosApi.completedTodayTodos,
                total: todosApi.todayTodos.length,
              })}
            </Text>
          </View>

          <Text style={styles.todayTitle}>{t("home.today")}</Text>

          {todosApi.isLoading && (
            <Text style={styles.emptyText}>{t("home.loading")}</Text>
          )}
        </View>
      }
      ListEmptyComponent={
        !todosApi.isLoading ? (
          <Text style={styles.emptyText}>{t("home.empty")}</Text>
        ) : null
      }
      renderItem={({ item }) => (
        <TodoCard
          todo={item}
          onToggle={todosApi.toggleTodo}
          onDelete={todosApi.deleteTodo}
          onOpen={onOpenTodo}
        />
      )}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 20,
      paddingBottom: 120,
    },
    header: {
      marginTop: 20,
      marginBottom: 20,
      paddingRight: 54,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 16,
      marginTop: 6,
    },
    createButton: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 16,
      alignItems: "center",
      marginBottom: 16,
    },
    createButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "900",
    },
    progressCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 18,
    },
    progressText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },
    todayTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 12,
    },
    emptyText: {
      color: colors.textDisabled,
      textAlign: "center",
      marginTop: 28,
      marginBottom: 20,
      fontSize: 15,
    },
  });
}