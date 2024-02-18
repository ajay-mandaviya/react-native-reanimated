import { View, Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;
const images = [
  "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80",
  "https://images.unsplash.com/photo-1562569633-622303bafef5?w=800&q=80",
  "https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=800&q=80",
  "https://images.unsplash.com/photo-1555096462-c1c5eb4e4d64?w=800&q=80",
  "https://images.unsplash.com/photo-1517957754642-2870518e16f8?w=800&q=80",
  "https://images.unsplash.com/photo-1546484959-f9a381d1330d?w=800&q=80",
  "https://images.unsplash.com/photo-1548761208-b7896a6ff225?w=800&q=80",
  "https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?w=800&q=80",
  "https://images.unsplash.com/photo-1548614606-52b4451f994b?w=800&q=80",
  "https://images.unsplash.com/photo-1548600916-dc8492f8e845?w=800&q=80",
];
const data = images.map((image, index) => ({
  key: String(index),
  photo: image,
  avatar_url: `https://randomuser.me/api/portraits/women/${Math.floor(
    Math.random() * 40
  )}.jpg`,
}));

const ParallaxCarousel = () => {
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event, context) {
      scrollX.value = event.contentOffset.x;
    },
  });

  console.log("scroo", scrollX?.value);

  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return <Card index={index} scrollX={scrollX} item={item} />;
        }}
      />
    </View>
  );
};
const Card = ({ index, scrollX, item }: any) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(scrollX.value, inputRange, [
            -width * 0.7,
            0,
            width * 0.7,
          ]),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={{ width, justifyContent: "center", alignItems: "center" }}
    >
      <Animated.View
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          overflow: "hidden",
          alignItems: "center",
          ...styles.imageContainer,
        }}
      >
        <Animated.Image
          source={{ uri: item.photo }}
          style={[
            animatedStyle,
            {
              width: ITEM_WIDTH * 1.4,
              height: ITEM_HEIGHT,
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 18,
    borderWidth: 10,
    borderColor: "white",
    shadowColor: "#000",
    shadowOpacity: 1,
    elevation: 10,
    shadowRadius: 20,
    shadowOffset: { height: 0, width: 0 },
  },
});

export default ParallaxCarousel;
