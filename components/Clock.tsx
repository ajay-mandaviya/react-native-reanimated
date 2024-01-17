import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const N = 12;
const SQUIRE_SIZE = 12;
const Clock = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(4 * Math.PI, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  return (
    <View style={styles.container}>
      {new Array(12).fill(9).map((_, index) => {
        return (
          <ClockSqure
            index={index}
            key={`${index}~clock`}
            progress={progress}
          />
        );
      })}
    </View>
  );
};

interface Props {
  index: number;
  progress: Animated.SharedValue<number>;
}
const ClockSqure: React.FC<Props> = ({ index, progress }) => {
  const offsetAngle = (2 * Math.PI) / N;
  const finalAngle = offsetAngle * (N - 1 - index);

  const rotate = useDerivedValue(() => {
    if (progress.value <= 2 * Math.PI) {
      return Math.min(finalAngle, progress.value);
    } else if (progress.value - 2 * Math.PI < finalAngle) {
      // start again
      return finalAngle;
    }
    return progress.value;
  }, []);

  const translateY = useDerivedValue(() => {
    if (rotate.value === finalAngle) {
      return -N * SQUIRE_SIZE;
    }
    if(progress.value> 2 * Math.PI){
      return withTiming(index -N * SQUIRE_SIZE)
     }
    return -index * SQUIRE_SIZE;
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate}rad` }, { translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[styles.item, animatedStyle, { opacity: (index + 1) / N }]}
    ></Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  item: {
    height: SQUIRE_SIZE,
    backgroundColor: "white",
    opacity: 1,
    aspectRatio: 1,
    position: "absolute",
  },
});

export default Clock;
