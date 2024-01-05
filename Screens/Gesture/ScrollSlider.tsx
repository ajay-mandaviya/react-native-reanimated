import React, { useCallback, useReducer, useRef } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import Svg, { Circle } from "react-native-svg";

const titles = [`what's`, "up", "mobile", "dev"];
const { width: PAGE_WIDTH, height } = Dimensions.get("window");

type GestContext = {
  x: number;
};
const imageUri =
  "https://images.unsplash.com/photo-1621569642780-4864752e847e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80";

const ScrollSlider = () => {
  const translationX = useSharedValue(0);

  const clampedTransX = useDerivedValue(() => {
    const MAX_TRANS_x = -PAGE_WIDTH * (titles.length - 1);
    return Math.max(Math.min(translationX.value, 0), MAX_TRANS_x);
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestContext
  >({
    onStart: (_, context) => {
      context.x = clampedTransX.value;
    },
    onActive: (event, context) => {
      console.log(event.translationX);
      translationX.value = event.translationX + context.x;
    },
    onEnd: (event) => {
      translationX.value = withDecay({ velocity: event.velocityX });
    },
  });

  return (
    <View style={style.screen}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={{ flex: 1, flexDirection: "row" }}>
          <CircleProgress />
          {/* {titles.map((ele, index) => {
            return (
              <Page
                title={ele}
                translationX={clampedTransX}
                index={index}
                key={`${ele}-${index}`}
              ></Page>
            );
          })} */}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

interface Props {
  index: number;
  title: string;
  translationX: Animated.SharedValue<number>;
}

const Page: React.FC<Props> = ({ index, translationX, title }) => {
  console.log({ index });

  const pageOffset = PAGE_WIDTH * index;
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value + pageOffset }],
    };
  });

  const doubleTapRef = useRef();
  const scale = useSharedValue(0);
  const aniStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: Math.max(scale.value, 0) }],
    };
  });

  const onDOubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (finished) => {
      if (finished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: `rgba(0,0,256,0.${index})`,
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          justifyContent: "center",
        },
        rStyle,
      ]}
    >
      {index === 2 && (
        <TapGestureHandler
          waitFor={doubleTapRef}
          onActivated={() => {
            console.log("tap");
          }}
        >
          <TapGestureHandler
            ref={doubleTapRef}
            numberOfTaps={2}
            maxDelayMs={250}
            onActivated={onDOubleTap}
          >
            <Animated.View>
              <ImageBackground
                source={{ uri: imageUri }}
                style={style.imageStyle}
              >
                <Animated.View style={[style.heart, aniStyle]}></Animated.View>
              </ImageBackground>
            </Animated.View>
          </TapGestureHandler>
        </TapGestureHandler>
      )}
    </Animated.View>
  );
};

const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "#303858";
const STROKE_COLOR = "#A6E1FA";
const CRICLE_LENGTH = 1000;
const R = CRICLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleProgress = () => {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CRICLE_LENGTH * (1 - progress.value),
  }));

  React.useEffect(() => {
    progress.value = withTiming(0.5, { duration: 2000 });
  }, []);

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`;
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg>
        <AnimatedCircle
          cx={PAGE_WIDTH / 2}
          cy={height / 2}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={20}
        />
        <AnimatedCircle
          cx={PAGE_WIDTH / 2}
          cy={height / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CRICLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={"round"}
        />
        <ReText text={progressText} />
      </Svg>
    </View>
  );
};

const style = StyleSheet.create({
  screen: {
    flex: 1,
  },
  imageStyle: {
    width: PAGE_WIDTH,
    height: height,
  },
  heart: {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: 20,
    shadowOffset: {
      height: 20,
      width: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 4,
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default ScrollSlider;
