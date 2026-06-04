import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type BrandTextProps = {
  size?: number;
};

export function BrandText({ size = 40 }: BrandTextProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, size);

  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>
        Dopa<Text style={styles.accentText}>DO</Text>
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors, size: number) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    baseText: {
      color: colors.text,
      fontSize: size,
      fontWeight: "900",
      letterSpacing: 0.4,
    },
    accentText: {
      color: colors.reward,
      fontSize: size,
      fontWeight: "900",
      letterSpacing: 0.4,
    },
  });
}