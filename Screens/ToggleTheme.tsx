import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Text, Dimensions, Switch, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const Colors = {
  dark: {
    background: "#1E1E1E",
    circle: "#252525",
    text: "#F8F8F8",
  },
  light: {
    background: "#F8F8F8",
    circle: "#FFF",
    text: "#1E1E1E",
  },
};
const SIZE = Dimensions.get("window").width * 0.7;

const SWITCH_TRACK_COLOR = {
  true: "rgba(256, 0, 256, 0.2)",
  false: "rgba(0,0,0,0.1)",
};

type Theme = "light" | "dark";

const ToggleTheme = () => {
  const [theme, setTheme] = useState<Theme>("light");

  const progressValue = useDerivedValue(() => {
    return theme === "dark" ? withTiming(1) : withTiming(0);
  }, [theme]);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressValue.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background]
    );
    return {
      backgroundColor,
    };
  }, [progressValue.value]);

  const cricleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressValue.value,
      [0, 1],
      [Colors.light.circle, Colors.dark.circle]
    );
    return {
      backgroundColor,
    };
  }, [progressValue.value]);

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progressValue.value,
      [0, 1],
      [Colors.light.text, Colors.dark.text]
    );
    return {
      color,
    };
  });
  return (
    <Animated.View style={[style.container, rStyle]}>
        <Animated.Text style = {[style.text , textStyle]}>Them Application</Animated.Text>
      <Animated.View style={[style.circle, cricleStyle]}>
        <Switch
          value={theme === "dark"}
          onValueChange={(toggled) => {
            setTheme(toggled ? "dark" : "light");
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  circle: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZE / 2,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 8,
  },
  text : {
    fontSize : 20,
    textTransform : 'uppercase',
    letterSpacing : 1,
    marginBottom : 40,
  }
});

export default ToggleTheme;
