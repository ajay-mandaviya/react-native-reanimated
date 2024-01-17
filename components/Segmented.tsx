import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const Palette = {
  grey05: "#E5E2DC",
  grey80: "#30302E",
  backgroud: "#F1EEEB",
};

type ComponentProps = {
  options: string[];
  selectedOption?: string;
  onPress?: (option: string) => void;
};
const options = ["Light", "Standard", "Pro"];

const Segmented: React.FC<ComponentProps> = ({}) => {
  const { width: windowWidth } = useWindowDimensions();

  const containerWidth = windowWidth - 40;
  const itemWidth = containerWidth / options.length;

  const [selectedOption, setSelectedOption] = React.useState("Light");

  const activeAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(itemWidth * options.indexOf(selectedOption)),
    };
  });

  return (
    <View style={style.screen}>
      <View
        style={[style.container, { width: containerWidth, borderRadius: 20 }]}
      >
        <Animated.View
          style={[
            style.activeView,
            {
              width: itemWidth - 10,
              paddingHorizontal: 20
            },
            activeAnimatedStyle,
          ]}
        />
        {options.map((ele) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedOption(ele)}
              style={[style.itemContainer, { width: itemWidth }]}
              key={ele}
            >
              <Text>{ele}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: Palette.grey05,
  },
  activeView: {
    position: "absolute",
    backgroundColor: Palette.backgroud,
    height: "90%",
    top: "8%",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    // elevation: 1,
    shadowOffset: { height: 0, width: 0 },
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Segmented;
