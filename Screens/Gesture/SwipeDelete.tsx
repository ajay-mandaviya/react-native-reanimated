import React, { useCallback, useRef } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
const TITLES = [
  "Record the dismissible tutorial 🎥",
  "Leave 👍🏼 to the video",
  "Check YouTube comments",
  "Subscribe to the channel 🚀",
  "Leave a ⭐️ on the GitHub Repo",
];

const ITEM_HEIGHT = 50;
interface TaskInterface {
  title: string;
  index: number;
}
const TASKS: TaskInterface[] = TITLES.map((title, index) => ({ title, index }));
const BACKGROUND_COLOR = "#FAFBFF";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

const SwipeDelete = () => {
  const [tasks, setTasks] = React.useState(TASKS);
  const scrollRef = useRef(null);

  const onDismiss = useCallback(
    (ele: TaskInterface) => {
      setTasks((task) => task.filter((item) => item.index !== ele.index));
    },
    [tasks]
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <ScrollView ref={scrollRef}>
          <Text style={styles.title}>Task</Text>
          {tasks.map((task, _index) => (
            <ListItem
              key={_index}
              task={task}
              onDismiss={onDismiss}
              simultaneousHandlers={scrollRef}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

interface ListItemProps
  extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  onDismiss?: (task: TaskInterface) => void;
  task: TaskInterface;
}
const ListItem: React.FC<ListItemProps> = ({
  task,
  onDismiss,
  simultaneousHandlers,
}) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
    },

    onEnd: () => {
      const shouldBeDeleted = translateX.value < TRANSLATE_X_THRESHOLD;
      if (shouldBeDeleted) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onDismiss) {
            runOnJS(onDismiss)(task);
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      withSpring(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0)
    );
    return {
      opacity: opacity,
    };
  });

  const taskContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.taskContainer, taskContainerStyle]}>
      <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
        <FontAwesome5
          name={"trash-alt"}
          size={ITEM_HEIGHT * 0.4}
          color={"red"}
        />
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={panGesture}
        simultaneousHandlers={simultaneousHandlers}
        // to fix scroll issue when user scroll with list gesture also conflict this will fix it,
      >
        <Animated.View style={[styles.task, animatedStyle]}>
          <Text>{task?.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default SwipeDelete;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  title: {
    fontSize: 40,
    marginVertical: 20,
  },
  taskContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 12,
  },
  task: {
    width: "90%",
    height: ITEM_HEIGHT,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 12,
    shadowOpacity: 1,
    shadowOffset: { height: 20, width: 0 },
    elevation: 5,
  },
  iconContainer: {
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
    position: "absolute",
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});
