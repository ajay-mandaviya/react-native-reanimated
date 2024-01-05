import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RippleBtn = () => {
  return (
    <View style={styles.container}>
      <Ripple
        style={styles.ripple}
        onTap={() => {
          console.log("parent tap");
        }}
      >
        <Text>Ripplr</Text>
      </Ripple>
    </View>
  );
};

interface IProps {
  style?: StyleProp<ViewStyle>;
  onTap?: () => void;
  children: any;
}

const Ripple: React.FC<IProps> = ({ style, onTap, children }) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);

  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const rippleOpacity = useSharedValue(1);
  const animatedRef = useAnimatedRef<Animated.View>();

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (tapEvent) => {
        const layout = measure(animatedRef);
        width.value = layout.width;
        height.value = layout.height;
        centerX.value = tapEvent.x;
        centerY.value = tapEvent.y;
        rippleOpacity.value = 1;
        scale.value = 0;
        scale.value = withTiming(1, { duration: 1000 });
      },
      onActive: () => {
        if (onTap) runOnJS(onTap)();
      },
      // onEnd: () => {
      //   rippleOpacity.value = withTiming(0);
      // },
      onFinish: ()=>{
        // rippleOpacity.value = 0;
      }
    });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;
    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      position: "absolute",
      backgroundColor: "skyblue",
      opacity: rippleOpacity.value,
      transform: [{ translateX }, { translateY }, { scale: scale.value }],
      top: 0,
      left: 0,
    };
  });

  return (
    <Animated.View ref={animatedRef}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, { overflow: "hidden" }]}>
          <View>{children}</View>
          <Animated.View style={rStyle}></Animated.View>
        </Animated.View>
      </TapGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    shadowOpacity: 0.2,
    shadowOffset: { height: 0, width: 0 },
    elevation: 6,
    shadowRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});

export default RippleBtn;
