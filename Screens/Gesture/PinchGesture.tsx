import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { height, width } = Dimensions.get("window");
const PinchGesture = () => {
  const imageUri =
    "https://images.unsplash.com/photo-1621569642780-4864752e847e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80";

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchaHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (event) => {
        console.log("event", event);
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
    });
  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const focalPointStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });
  return (
    <PinchGestureHandler onGestureEvent={pinchaHandler}>
      <Animated.View style={{ flex: 1 }}>
        <AnimatedImage
          style={[style.imagStyle, imageStyle]}
          source={{ uri: imageUri }}
        />
        <Animated.View style={[style.focalPoint, focalPointStyle]} />
      </Animated.View>
    </PinchGestureHandler>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagStyle: {
    flex: 1,
  },
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    backgroundColor: "red",
  },
});

export default PinchGesture;
