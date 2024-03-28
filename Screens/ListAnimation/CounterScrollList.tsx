import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import React, { useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
const { width, height } = Dimensions.get("window");
const colors = {
  black: "#323F4E",
  red: "#F76A6A",
  text: "#ffffff",
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;
const CounterScrollList = () => {
  //
  const scrollX = useSharedValue(0);
  const [duration, setDuration] = React.useState(timers[0]);
  const timerAnimation = useSharedValue(height);
  const textInputAnimation = useSharedValue([timers[0]])
  const buttonAnimation = useSharedValue(0);
  const inputRef = useRef();
  //
  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event, context) {
      scrollX.value = event.contentOffset.x;
    },
  });

  const doAnimation = () => {
    timerAnimation.value = withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(height, { duration: duration * 1000 })
    );
    buttonAnimation.value = withSequence(
      withTiming(1, { duration: 300 }, (isFinish) => {})
    );
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: timerAnimation.value }],
    };
  });

  const inputRange = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
  const animatedButton = useAnimatedStyle(() => {
    const transY = interpolate(scrollX.value, [0, 1], [0, 200]);
    return {
      opacity: inputRange,
      transform: [{ translateY: transY }],
    };
  });

  const textAnimatedViewStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, [0, 1], [0, 1]);
    return {
      opacity,
    };
  });

  const flatListAnimation = useAnimatedStyle(() => {
    return {
      opacity: inputRange,
      flexGrow: 0,
    };
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height,
            width,
            backgroundColor: colors.red,
          },
          animatedStyle,
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
          },
          animatedButton,
        ]}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={doAnimation}>
          <View style={styles.roundButton}></View>
        </TouchableOpacity>
      </Animated.View>

      <View
        style={{
          position: "absolute",
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: ITEM_SIZE,
                justifyContent: "center",
                alignItems: "center",
              },
              textAnimatedViewStyle,
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.text}
              defaultValue={duration.toString()}
              editable={false}
            />
          </Animated.View>
          <Animated.FlatList
            data={timers}
            onScroll={scrollHandler}
            keyExtractor={(item) => item.toString()}
            horizontal
            bounces={false}
            style={flatListAnimation}
            snapToInterval={ITEM_SPACING}
            onMomentumScrollEnd={(e) => {
              const _index = Math.round(
                e.nativeEvent.contentOffset.x / ITEM_SIZE
              );
              console.log("_index", _index);
              setDuration(timers[_index]);
            }}
            decelerationRate={"normal"}
            contentContainerStyle={{
              paddingHorizontal: ITEM_SPACING,
            }}
            renderItem={({ item, index }) => {
              return <Item item={item} index={index} scrollX={scrollX} />;
            }}
          />
        </>
      </View>
    </View>
  );
};

const Item = ({ item, index, scrollX }: any) => {
  const inputRange = [
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
    (index + 1) * ITEM_SIZE,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);
    const scale = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);
    return {
      opacity: opacity,
      transform: [{ scale: scale }],
    };
  });

  return (
    <Animated.View
      style={{
        width: ITEM_SIZE,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.Text style={[styles.text, animatedStyle]}>{item}</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
  },
  text: {
    fontSize: 84,
    color: colors.text,
    fontWeight: "900",
  },
});

export default CounterScrollList;
