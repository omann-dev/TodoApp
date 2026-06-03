import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useAppSettings } from "../settings/AppSettingsContext";

type SettingsScreenProps = {
  onClose: () => void;
};

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dopamineModeEnabled, setDopamineModeEnabled] = useState(true);

  const { colors, themeName, setThemeName } = useTheme();
  const styles = createStyles(colors);

  const {
    dailyDopamineGoal,
    dopaminePointsPerTodo,
    setDailyDopamineGoal,
  } = useAppSettings();

  const [goalInput, setGoalInput] = useState(String(dailyDopamineGoal));

  useEffect(() => {
    setGoalInput(String(dailyDopamineGoal));
  }, [dailyDopamineGoal]);

  const isDarkTheme = themeName === "dark";

  async function handleSaveGoal() {
    const parsedGoal = Number(goalInput);

    if (Number.isNaN(parsedGoal) || parsedGoal <= 0) {
      setGoalInput(String(dailyDopamineGoal));
      return;
    }

    await setDailyDopamineGoal(parsedGoal);
  }

  async function applyGoalPreset(goal: number) {
    setGoalInput(String(goal));
    await setDailyDopamineGoal(goal);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Einstellungen</Text>
          <Text style={styles.subtitle}>Passe Dopado an dich an.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Darstellung</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dunkles Theme</Text>
            <Text style={styles.settingDescription}>
              Wechsle zwischen hellem und dunklem Design.
            </Text>
          </View>

          <Switch
            value={isDarkTheme}
            onValueChange={(value) =>
              void setThemeName(value ? "dark" : "light")
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gamification</Text>

        <View style={styles.goalCard}>
          <Text style={styles.settingTitle}>Tägliche Dopamin-Dosis</Text>
          <Text style={styles.settingDescription}>
            Jede erledigte Todo gibt aktuell {dopaminePointsPerTodo} DP. Hier
            legst du fest, wie viele Punkte deine Tagesleiste füllen.
          </Text>

          <View style={styles.goalInputRow}>
            <TextInput
              style={styles.goalInput}
              keyboardType="number-pad"
              value={goalInput}
              onChangeText={setGoalInput}
              onBlur={handleSaveGoal}
              placeholder="100"
              placeholderTextColor={colors.textDisabled}
            />

            <Pressable style={styles.saveButton} onPress={handleSaveGoal}>
              <Text style={styles.saveButtonText}>Speichern</Text>
            </Pressable>
          </View>

          <View style={styles.presetRow}>
            <PresetButton label="Easy" value={50} onPress={applyGoalPreset} />
            <PresetButton label="Normal" value={100} onPress={applyGoalPreset} />
            <PresetButton label="Hard" value={150} onPress={applyGoalPreset} />
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dopamin-Modus</Text>
            <Text style={styles.settingDescription}>
              Kleine motivierende Fortschrittsanzeigen aktivieren.
            </Text>
          </View>

          <Switch
            value={dopamineModeEnabled}
            onValueChange={setDopamineModeEnabled}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allgemein</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Tägliche Erinnerung</Text>
            <Text style={styles.settingDescription}>
              Später kannst du dich an offene Todos erinnern lassen.
            </Text>
          </View>

          <Switch
            value={dailyReminderEnabled}
            onValueChange={setDailyReminderEnabled}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daten</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Lokale Speicherung</Text>
          <Text style={styles.infoText}>
            Deine Todos und Einstellungen werden aktuell lokal auf deinem Gerät
            gespeichert.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Version</Text>
          <Text style={styles.infoText}>Dopado 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

type PresetButtonProps = {
  label: string;
  value: number;
  onPress: (value: number) => void;
};

function PresetButton({ label, value, onPress }: PresetButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable style={styles.presetButton} onPress={() => onPress(value)}>
      <Text style={styles.presetLabel}>{label}</Text>
      <Text style={styles.presetValue}>{value} DP</Text>
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
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 20,
      marginBottom: 28,
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
      fontSize: 32,
      fontWeight: "800",
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 15,
      marginTop: 4,
    },
    section: {
      marginBottom: 26,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "800",
      marginBottom: 12,
    },
    settingRow: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
    },
    settingDescription: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 19,
    },
    goalCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 12,
    },
    goalInputRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
      marginBottom: 12,
    },
    goalInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      fontWeight: "700",
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      color: "#ffffff",
      fontWeight: "800",
    },
    presetRow: {
      flexDirection: "row",
      gap: 10,
    },
    presetButton: {
      flex: 1,
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 10,
      alignItems: "center",
    },
    presetLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
    },
    presetValue: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 3,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 18,
      marginBottom: 12,
    },
    infoTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
    },
    infoText: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 19,
    },
  });
}