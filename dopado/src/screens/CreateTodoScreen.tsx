import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { UseTodosResult } from "../hooks/useTodos";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useCategories } from "../hooks/useCategories";
import {
  formatShortDisplayDate,
  getDateKeyWithOffset,
  getTodayDateKey,
  isValidDateKey,
} from "../services/dateService";
import { useI18n } from "../i18n/I18nContext";

type CreateTodoScreenProps = {
  todosApi: UseTodosResult;
  onBack: () => void;
  onCreated: () => void;
};

const CATEGORY_COLORS = [
  "#546DE5", // Blau
  "#3DC1D3", // Cyan
  "#63CDDA", // Hellcyan
  "#574B90", // Lila
  "#F5CD79", // Gelb
  "#F7D794", // Warmes Gelb
  "#F19066", // Orange
  "#E66767", // Rot
  "#C44569", // Pink/Deep Rose
  "#F8A5C2", // Rosa
  "#596275", // Grau-Blau
  "#303952", // Dunkelblau
  "#2ED573", // Grün
  "#1E90FF", // Hellblau
  "#FFA502", // Orange-Gelb
  "#FF4757", // Rot
];

export function CreateTodoScreen({
  todosApi,
  onBack,
  onCreated,
}: CreateTodoScreenProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  const { categories, addCategory } = useCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plannedForDate, setPlannedForDate] = useState(getTodayDateKey());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[2]);

  const isTitleValid = title.trim().length > 0;
  const isDateValid = isValidDateKey(plannedForDate);
  const canCreateTodo = isTitleValid && isDateValid;

  async function handleCreateTodo() {
    if (!canCreateTodo) {
      return;
    }

    await todosApi.addTodo({
      title,
      description,
      plannedFor: plannedForDate,
      categoryId: selectedCategoryId,
    });

    onCreated();
  }

  async function handleCreateCategory() {
    const category = await addCategory(newCategoryName, newCategoryColor);

    if (!category) {
      return;
    }

    setSelectedCategoryId(category.id);
    setNewCategoryName("");
    setIsCategoryMenuOpen(false);
  }

  function selectDateByOffset(dayOffset: number) {
    setPlannedForDate(getDateKeyWithOffset(dayOffset));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{t("createTodo.title")}</Text>
            <Text style={styles.subtitle}>{t("createTodo.subtitle")}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t("createTodo.heading")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("createTodo.headingPlaceholder")}
            placeholderTextColor={colors.textDisabled}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>{t("createTodo.description")}</Text>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder={t("createTodo.descriptionPlaceholder")}
            placeholderTextColor={colors.textDisabled}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>{t("createTodo.plannedFor")}</Text>

          <View style={styles.datePresetRow}>
            <DatePresetButton
              label={t("createTodo.today")}
              dateKey={getDateKeyWithOffset(0)}
              selectedDateKey={plannedForDate}
              onPress={() => selectDateByOffset(0)}
            />

            <DatePresetButton
              label={t("createTodo.tomorrow")}
              dateKey={getDateKeyWithOffset(1)}
              selectedDateKey={plannedForDate}
              onPress={() => selectDateByOffset(1)}
            />

            <DatePresetButton
              label={t("createTodo.dayAfterTomorrow")}
              dateKey={getDateKeyWithOffset(2)}
              selectedDateKey={plannedForDate}
              onPress={() => selectDateByOffset(2)}
            />
          </View>

          <TextInput
            style={[styles.input, !isDateValid && styles.inputInvalid]}
            value={plannedForDate}
            onChangeText={setPlannedForDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textDisabled}
          />

          <Text
            style={[
              styles.helperText,
              !isDateValid && styles.helperTextInvalid,
            ]}
          >
            {isDateValid
              ? t("createTodo.selectedDate", {
                  date: formatShortDisplayDate(plannedForDate),
                })
              : t("createTodo.invalidDate")}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>{t("createTodo.category")}</Text>
              <Text style={styles.helperText}>
                {t("createTodo.categoryDescription")}
              </Text>
            </View>

            <Pressable
              style={styles.smallButton}
              onPress={() => setIsCategoryMenuOpen((current) => !current)}
            >
              <Text style={styles.smallButtonText}>
                {isCategoryMenuOpen ? t("createTodo.close") : t("createTodo.new")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.categoryList}>
            <Pressable
              style={[
                styles.categoryChip,
                selectedCategoryId === null && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategoryId(null)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategoryId === null &&
                    styles.categoryChipTextSelected,
                ]}
              >
                {t("createTodo.none")}
              </Text>
            </Pressable>

            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id;

              return (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategoryId(category.id)}
                >
                  <View
                    style={[
                      styles.categoryColorDot,
                      { backgroundColor: category.color },
                    ]}
                  />

                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {isCategoryMenuOpen && (
            <View style={styles.categoryMenu}>
              <Text style={styles.label}>{t("createTodo.newCategory")}</Text>

              <TextInput
                style={styles.input}
                placeholder={t("createTodo.categoryPlaceholder")}
                placeholderTextColor={colors.textDisabled}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />

              <Text style={styles.label}>{t("createTodo.color")}</Text>

              <View style={styles.colorRow}>
                {CATEGORY_COLORS.map((color) => {
                  const isSelected = color === newCategoryColor;

                  return (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        isSelected && styles.colorButtonSelected,
                      ]}
                      onPress={() => setNewCategoryColor(color)}
                    />
                  );
                })}
              </View>

              <Pressable
                style={[
                  styles.createCategoryButton,
                  newCategoryName.trim().length === 0 &&
                    styles.createButtonDisabled,
                ]}
                onPress={handleCreateCategory}
              >
                <Text style={styles.createCategoryButtonText}>
                  {t("createTodo.createCategory")}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.createButton,
            !canCreateTodo && styles.createButtonDisabled,
          ]}
          onPress={handleCreateTodo}
        >
          <Text style={styles.createButtonText}>{t("createTodo.create")}</Text>
        </Pressable>
      </ScrollView>
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
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      padding: 16,
      marginBottom: 16,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
    },
    label: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "900",
      marginBottom: 8,
      marginTop: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderRadius: 15,
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 4,
    },
    descriptionInput: {
      minHeight: 110,
      lineHeight: 21,
    },
    inputInvalid: {
      borderColor: colors.danger,
    },
    helperText: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 6,
      fontWeight: "700",
      lineHeight: 18,
    },
    helperTextInvalid: {
      color: colors.danger,
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
    sectionHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    smallButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 999,
    },
    smallButtonText: {
      color: "#ffffff",
      fontWeight: "900",
      fontSize: 12,
    },
    categoryList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 999,
    },
    categoryChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryColorDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },
    categoryChipText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
    },
    categoryChipTextSelected: {
      color: "#ffffff",
    },
    categoryMenu: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 14,
      marginTop: 16,
    },
    colorRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 14,
    },
    colorButton: {
      width: 34,
      height: 34,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "transparent",
    },
    colorButtonSelected: {
      borderColor: colors.text,
    },
    createCategoryButton: {
      backgroundColor: colors.primary,
      borderRadius: 15,
      paddingVertical: 13,
      alignItems: "center",
    },
    createCategoryButtonText: {
      color: "#ffffff",
      fontWeight: "900",
    },
    createButton: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 4,
    },
    createButtonDisabled: {
      opacity: 0.45,
    },
    createButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "900",
    },
  });
}