import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useAppSettings } from "../settings/AppSettingsContext";
import { formatDisplayDate } from "../services/dateService";
import { useI18n } from "../i18n/I18nContext";

type TodoDetailScreenProps = {
  todoId: string;
  todosApi: UseTodosResult;
  onBack: () => void;
  onEdit: (todoId: string) => void;
};

export function TodoDetailScreen({
  todoId,
  todosApi,
  onBack,
  onEdit,
}: TodoDetailScreenProps) {
  const { colors } = useTheme();
  const { t, language } = useI18n();
  const styles = createStyles(colors);

  const { dopaminePointsPerTodo } = useAppSettings();

  const todo = todosApi.allTodos.find((item) => item.id === todoId);

  if (!todo) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Text style={styles.title}>{t("todoDetail.notFound")}</Text>
          <Text style={styles.subtitle}>
            {t("todoDetail.notFoundDescription")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{t("todoDetail.title")}</Text>
          <Text style={styles.subtitle}>{t("todoDetail.subtitle")}</Text>
        </View>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              todo.isDone ? styles.statusBadgeDone : styles.statusBadgeOpen,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {todo.isDone ? t("todoDetail.done") : t("todoDetail.open")}
            </Text>
          </View>

          <Text style={styles.pointsText}>
            {todo.isDone ? `+${dopaminePointsPerTodo} DP` : "+0 DP"}
          </Text>
        </View>

        <Text style={styles.todoTitle}>{todo.title}</Text>

        {todo.categoryName && (
          <View style={styles.categoryChip}>
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: todo.categoryColor ?? colors.primary },
              ]}
            />

            <Text style={styles.categoryText}>{todo.categoryName}</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.editButton} onPress={() => onEdit(todo.id)}>
        <Text style={styles.editButtonText}>{t("todoDetail.edit")}</Text>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t("todoDetail.description")}</Text>

        <Text style={styles.descriptionText}>
          {todo.description && todo.description.trim().length > 0
            ? todo.description
            : t("todoDetail.noDescription")}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t("todoDetail.planning")}</Text>

        <InfoRow
          label={t("todoDetail.plannedFor")}
          value={formatDisplayDate(todo.plannedFor)}
        />

        <InfoRow
          label={t("todoDetail.createdAt")}
          value={formatDateTime(todo.createdAt, language)}
        />

        {todo.completedAt && (
          <InfoRow
            label={t("todoDetail.completedAt")}
            value={formatDateTime(todo.completedAt, language)}
          />
        )}
      </View>
    </ScrollView>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function formatDateTime(timestamp: string, language: "de" | "en"): string {
  const locale = language === "de" ? "de-DE" : "en-US";

  return new Date(timestamp).toLocaleString(locale, {
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
      paddingBottom: 120,
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
      fontSize: 30,
      fontWeight: "900",
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 15,
      marginTop: 4,
      lineHeight: 20,
    },
    mainCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      padding: 18,
      marginBottom: 16,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
    },
    statusBadgeDone: {
      backgroundColor: colors.success,
    },
    statusBadgeOpen: {
      backgroundColor: colors.danger,
    },
    statusBadgeText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0.8,
    },
    pointsText: {
      color: colors.reward,
      fontSize: 14,
      fontWeight: "900",
    },
    todoTitle: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "900",
      lineHeight: 32,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 16,
    },
    categoryDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },
    categoryText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
    },
    editButton: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 15,
      alignItems: "center",
      marginBottom: 16,
    },
    editButtonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "900",
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 12,
    },
    descriptionText: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "600",
    },
    infoRow: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      marginTop: 12,
    },
    infoLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.7,
    },
    infoValue: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      lineHeight: 21,
    },
  });
}