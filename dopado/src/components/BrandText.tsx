import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type BrandTextProps = {
  size?: number;
  showLogo?: boolean;
};

export function BrandText({ size = 40, showLogo = true }: BrandTextProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, size);

  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>
        Dopa<Text style={styles.accentText}>DO</Text>
      </Text>

      {showLogo && (
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors, size: number) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
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
    logo: {
      width: size * 0.9,
      height: size * 0.9,
      borderRadius: size * 0.22,
    },
  });
}