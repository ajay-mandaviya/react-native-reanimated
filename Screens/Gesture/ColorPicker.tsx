import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useCallback } from "react";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const colors = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];

const BACKGROUD_COLOR = "rgba(0,0,0,0.9)";
const PICKER_WIDTH = Dimensions.get("window").width * 0.9;
const CIRCLE_PICKER_SIZE = 45;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;
const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.7;
const ColorPicker = () => {
  const pickedColor = useSharedValue(colors[0]);
  const cricleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  const onColorChanged = useCallback((color: string) => {
    "worklet";
    pickedColor.value = color;
  }, []);
  return (
    <>
      <View style={style.topCOntainer}>
        <Animated.View style={[style.circle, cricleStyle]}></Animated.View>
      </View>
      <View style={style.bottomContainer}>
        <Picker
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          onColorChanged={onColorChanged}
        />
      </View>
    </>
  );
};

interface PickerProps extends LinearGradientProps {
  onColorChanged: (color: string | number) => void;
}

const Picker: React.FC<PickerProps> = ({
  colors,
  start,
  end,
  onColorChanged,
}) => {
  const thumbTransX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  //
  const adjustTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(thumbTransX.value, 0),
      PICKER_WIDTH - CIRCLE_PICKER_SIZE
    );
  });
  const gestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_, prev) => {
      prev.x = adjustTranslateX.value;
      // translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      // scale.value = withSpring(1.2);
    },
    onActive: (event, prev) => {
      thumbTransX.value = event.translationX + prev.x;
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: adjustTranslateX.value },
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const internalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, _index) => (_index / colors.length) * PICKER_WIDTH
    );
    const backgroundColor = interpolateColor(
      thumbTransX.value,
      inputRange,
      colors
    );
    onColorChanged?.(backgroundColor);
    return {
      backgroundColor: backgroundColor,
    };
  });

  const tapGesture = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {
      translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      scale.value = withSpring(1.2);
      thumbTransX.value = withSpring(event.absoluteX - CIRCLE_PICKER_SIZE);
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    },
  });
  return (
    <TapGestureHandler onGestureEvent={tapGesture}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={gestureEvent}>
          <Animated.View style={{ justifyContent: "center" }}>
            <LinearGradient
              key={"d"}
              colors={colors}
              start={start}
              end={end}
              style={style.gradient}
            />
            <Animated.View style={[style.picker, thumbStyle]}>
              <Animated.View
                style={[style.internalPicker, internalPickerStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

const style = StyleSheet.create({
  topCOntainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUD_COLOR,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUD_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    height: 50,
    width: PICKER_WIDTH,
    borderRadius: 20,
  },
  picker: {
    position: "absolute",
    backgroundColor: "#fff",
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  internalPicker: {
    // backgroundColor: "red",
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "red",
  },
});
export default ColorPicker;
