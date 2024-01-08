import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const ICON_SIZE = 20;
const BUTTON_WIDTH = 170;
const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};
const MAX_SLIDE_OFFSET = BUTTON_WIDTH * 0.4;
const SlideCounter = () => {
  const transxCircle = useSharedValue(0);
  const transYCircle = useSharedValue(0);
  const [count, setCount] = useState(0);
  const increMentCount = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);
  const decrementCount = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);
  const onPanGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: (event) => {
        transxCircle.value = clamp(
          event.translationX,
          -MAX_SLIDE_OFFSET,
          MAX_SLIDE_OFFSET
        );
        transYCircle.value = clamp(event.translationY, 0, MAX_SLIDE_OFFSET);
      },

      onFinish: () => {
        if (transxCircle.value === MAX_SLIDE_OFFSET) {
          runOnJS(increMentCount)();
        } else if (transxCircle.value === -MAX_SLIDE_OFFSET) {
          runOnJS(decrementCount)();
        }
        transxCircle.value = withSpring(0);
        transYCircle.value = withSpring(0);
      },
    });

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: transxCircle.value },
        { translateY: transYCircle.value },
      ],
    };
  });

  const increMentIConstyle = useAnimatedStyle(() => {
    // const opacity = interpolate(
    //   transxCircle.value,
    //   [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
    //   [0.4, 0.8, 0.4]
    // );
    const opacityX = interpolate(
      transxCircle.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.4, 0.8, 0.4]
    );
    const opacityY = interpolate(
      transxCircle.value,
      [0, MAX_SLIDE_OFFSET],
      [1, 0]
    );

    return { opacity: opacityX * opacityY };
  });

  const closeIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      transxCircle.value,
      [0, MAX_SLIDE_OFFSET],
      [0, 0.8]
    );
    return { opacity: opacity };
  });

  const rButtonContainer = useAnimatedStyle(()=>{
    return  {  transform : [{ translateX : transxCircle.value * 0.2 } , {  translateY : transYCircle.value * 0.2}] }
  })
  return (
    <View style={[styles.button,rButtonContainer]}>
      <Animated.View style={[increMentIConstyle]}>
        <AntDesign name="minus" color={"white"} size={ICON_SIZE} />
      </Animated.View>
      <Animated.View style={[closeIconStyle]}>
        <AntDesign name="close" color={"white"} size={ICON_SIZE} />
      </Animated.View>
      <Animated.View style={[increMentIConstyle]}>
        <AntDesign name="plus" color={"white"} size={ICON_SIZE} />
      </Animated.View>

      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <Animated.View style={[styles.circle, circleStyle]}>
            <Text style={styles.countText}>{count}</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

//
const SlideCount = () => {
  return (
    <View style={styles.container}>
      <SlideCounter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 70,
    width: BUTTON_WIDTH,
    backgroundColor: "#111111",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  circle: {
    height: 50,
    width: 50,
    backgroundColor: "#232323",
    borderRadius: 25,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 20,
    color: "white",
  },
});

export default SlideCount;
