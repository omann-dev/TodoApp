import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type SettingsScreenProps = {
  onClose: () => void;
};

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dopamineModeEnabled, setDopamineModeEnabled] = useState(true);

  const { colors, themeName, setThemeName } = useTheme();
  const styles = createStyles(colors);

  const isDarkTheme = themeName === "dark";

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
        <Text style={styles.sectionTitle}>Allgemein</Text>

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