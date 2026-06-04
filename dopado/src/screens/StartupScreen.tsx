import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BrandText } from "../components/BrandText";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";
import { useI18n } from "../i18n/I18nContext";

export function StartupScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <BrandText size={48} />

        <Text style={styles.tagline}>{t("startup.tagline")}</Text>
      </View>

      <View style={styles.loadingCard}>
        <ActivityIndicator size="small" color={colors.reward} />
        <Text style={styles.loadingText}>{t("startup.loading")}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    logoWrapper: {
      alignItems: "center",
      marginBottom: 42,
    },
    tagline: {
      color: colors.textMuted,
      fontSize: 16,
      fontWeight: "700",
      marginTop: 10,
      letterSpacing: 0.8,
    },
    loadingCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 999,
    },
    loadingText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },
  });
}