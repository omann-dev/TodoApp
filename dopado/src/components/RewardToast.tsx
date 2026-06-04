import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ThemeColors } from "../theme/theme";

type RewardToastProps = {
  triggerId: number;
  label: string;
};

export function RewardToast({ triggerId, label }: RewardToastProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (triggerId === 0) {
      return;
    }

    opacity.setValue(0);
    translateY.setValue(12);
    scale.setValue(0.9);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(520),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -28,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [triggerId, opacity, translateY, scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      position: "absolute",
      top: 150,
      alignSelf: "center",
      backgroundColor: colors.reward,
      borderRadius: 999,
      paddingHorizontal: 18,
      paddingVertical: 10,
      zIndex: 50,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.22,
      shadowRadius: 14,
      elevation: 8,
    },
    text: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "900",
      letterSpacing: 0.5,
    },
  });
}