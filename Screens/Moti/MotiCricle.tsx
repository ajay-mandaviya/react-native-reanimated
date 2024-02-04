import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "@motify/components";
import { Easing } from "react-native-reanimated";

const size = 100;
const color = "#6E01EF";

const CircleView = () => {
  return (
    <View style={[styles.dot, styles.center]}>
      {[...Array(3).keys()].map((index) => {
        return (
          <MotiView
            from={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 4 }}
            key={index}
            transition={{
              duration: 1500,
              type: "timing",
              easing: Easing.out(Easing.ease),
              loop: true,
              delay: index * 400,
              repeatReverse: false,
            }}
            style={[StyleSheet.absoluteFillObject, styles.dot]}
          />
        );
      })}
      <Feather name="phone-outgoing" size={32} color={"#fff"} />
    </View>
  );
};

const LoadingIndicator = ({ size }: { size: number }) => (
  <MotiView
    from={{
      width: size,
      height: size,
      borderRadius: size / 2,
    }}
    animate={{
      width: size + 20,
      height: size + 20,
      borderRadius: (size + 20) / 2,
    }}
    transition={{
      type : 'timing'  ,
      duration : 1000,
      repeat : -1
    }}
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: size / 10,
      borderColor: "#fff",
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 6,
      shadowColor: "#fff",
    }}
  />
);

const MotiCricle = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#010100",
      }}
    >
      <LoadingIndicator size={100} />
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: size,
    height: size,
    borderRadius: size,
    backgroundColor: color,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MotiCricle;
