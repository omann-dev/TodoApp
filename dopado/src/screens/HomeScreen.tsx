import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TodoCard } from "../components/TodoCard";
import { DopamineBar } from "../components/DopamineBar";
import { UseTodosResult } from "../hooks/useTodos";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useAppSettings } from "../settings/AppSettingsContext";
import { BrandText } from "../components/BrandText";
import {
  formatShortDisplayDate,
  getDateKeyWithOffset,
  getTodayDateKey,
  isValidDateKey,
} from "../services/dateService";

type HomeScreenProps = {
  todosApi: UseTodosResult;
};

export function HomeScreen({ todosApi }: HomeScreenProps) {
  const [todoText, setTodoText] = useState("");
  const [plannedForDate, setPlannedForDate] = useState(getTodayDateKey());

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { dailyDopamineGoal, dopaminePointsPerTodo } = useAppSettings();

  const dopaminePoints = todosApi.completedTodayTodos * dopaminePointsPerTodo;
  const isPlannedDateValid = isValidDateKey(plannedForDate);

  async function handleAddTodo() {
    if (!isPlannedDateValid || todoText.trim().length === 0) {
      return;
    }

    await todosApi.addTodo(todoText, plannedForDate);
    setTodoText("");
  }

  function selectDateByOffset(dayOffset: number) {
    setPlannedForDate(getDateKeyWithOffset(dayOffset));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={todosApi.todayTodos}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <BrandText size={42} />
              <Text style={styles.subtitle}>Mach kleine Aufgaben sichtbar.</Text>
            </View>

            <DopamineBar points={dopaminePoints} goal={dailyDopamineGoal} />

            <View style={styles.progressCard}>
              <Text style={styles.progressText}>
                {todosApi.completedTodayTodos} von {todosApi.todayTodos.length} heute erledigt
              </Text>
            </View>

            <View style={styles.createCard}>
              <Text style={styles.createTitle}>Neue Todo</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Neue Aufgabe..."
                  placeholderTextColor={colors.textDisabled}
                  value={todoText}
                  onChangeText={setTodoText}
                  onSubmitEditing={handleAddTodo}
                />

                <Pressable
                  style={[
                    styles.addButton,
                    (!isPlannedDateValid || todoText.trim().length === 0) &&
                      styles.addButtonDisabled,
                  ]}
                  onPress={handleAddTodo}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </Pressable>
              </View>

              <Text style={styles.dateLabel}>Geplant für</Text>

              <View style={styles.datePresetRow}>
                <DatePresetButton
                  label="Heute"
                  dateKey={getDateKeyWithOffset(0)}
                  selectedDateKey={plannedForDate}
                  onPress={() => selectDateByOffset(0)}
                />

                <DatePresetButton
                  label="Morgen"
                  dateKey={getDateKeyWithOffset(1)}
                  selectedDateKey={plannedForDate}
                  onPress={() => selectDateByOffset(1)}
                />

                <DatePresetButton
                  label="Übermorgen"
                  dateKey={getDateKeyWithOffset(2)}
                  selectedDateKey={plannedForDate}
                  onPress={() => selectDateByOffset(2)}
                />
              </View>

              <TextInput
                style={[
                  styles.dateInput,
                  !isPlannedDateValid && styles.dateInputInvalid,
                ]}
                value={plannedForDate}
                onChangeText={setPlannedForDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textDisabled}
              />

              <Text
                style={[
                  styles.selectedDateText,
                  !isPlannedDateValid && styles.selectedDateTextInvalid,
                ]}
              >
                {isPlannedDateValid
                  ? `Ausgewählt: ${formatShortDisplayDate(plannedForDate)}`
                  : "Ungültiges Datum. Nutze z. B. 2026-06-03."}
              </Text>
            </View>

            <Text style={styles.todayTitle}>Heute</Text>

            {todosApi.isLoading && (
              <Text style={styles.emptyText}>Lade Todos...</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !todosApi.isLoading ? (
            <Text style={styles.emptyText}>Noch keine Aufgaben für heute.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TodoCard
            todo={item}
            onToggle={todosApi.toggleTodo}
            onDelete={todosApi.deleteTodo}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}

type DatePresetButtonProps = {
  label: string;
  dateKey: string;
  selectedDateKey: string;
  onPress: () => void;
};

function DatePresetButton({
  label,
  dateKey,
  selectedDateKey,
  onPress,
}: DatePresetButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isSelected = dateKey === selectedDateKey;

  return (
    <Pressable
      style={[styles.datePresetButton, isSelected && styles.datePresetSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.datePresetLabel,
          isSelected && styles.datePresetLabelSelected,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.datePresetDate,
          isSelected && styles.datePresetDateSelected,
        ]}
      >
        {formatShortDisplayDate(dateKey)}
      </Text>
    </Pressable>
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
    progressCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 16,
    },
    progressText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    createCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 16,
      marginBottom: 18,
    },
    createTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 12,
    },
    inputContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 16,
      fontSize: 16,
    },
    addButton: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    addButtonDisabled: {
      opacity: 0.45,
    },
    addButtonText: {
      color: "#ffffff",
      fontSize: 30,
      fontWeight: "700",
      marginTop: -2,
    },
    dateLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    datePresetRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    datePresetButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingVertical: 10,
      paddingHorizontal: 8,
      alignItems: "center",
    },
    datePresetSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    datePresetLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "900",
    },
    datePresetLabelSelected: {
      color: "#ffffff",
    },
    datePresetDate: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 3,
      fontWeight: "700",
    },
    datePresetDateSelected: {
      color: "#ffffff",
      opacity: 0.9,
    },
    dateInput: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 14,
      fontSize: 15,
      fontWeight: "700",
    },
    dateInputInvalid: {
      borderColor: colors.danger,
    },
    selectedDateText: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 8,
      fontWeight: "700",
    },
    selectedDateTextInvalid: {
      color: colors.danger,
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