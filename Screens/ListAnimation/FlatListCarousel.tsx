import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import Animated, {
    interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const { width, height } = Dimensions.get("screen");

const ITEM_WIDTH = width;
const ITEM_HEIGHT = height * 0.75;
const DOT_SIZE = 8;
const DOT_SPACING = 8;

const INDICATOR_SIZE = DOT_SIZE + DOT_SPACING;

const images = [
  "https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_1_1_1.jpg?ts=1606727905128",
  "https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_1_1.jpg?ts=1606727908993",
  "https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_2_1.jpg?ts=1606727889015",
  "https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_3_1.jpg?ts=1606727896369",
  "https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_4_1.jpg?ts=1606727898445",
];

const product = {
  title: "SOFT MINI CROSSBODY BAG WITH KISS LOCK",
  description: [
    "Mini crossbody bag available in various colours. Featuring two compartments. Handles and detachable crossbody shoulder strap. Lined interior. Clasp with two metal pieces.",
    'Height x Length x Width: 14 x 21.5 x 4.5 cm. / 5.5 x 8.4 x 1.7"',
  ],
  price: "29.99£",
};
const FlatListCarousel = () => {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedIndicatorStyle  = useAnimatedStyle(()=>{
    const y = interpolate(scrollY.value/ITEM_HEIGHT ,[0, 1], [0 , INDICATOR_SIZE])
    return {
        transform : [{translateY : y }]
    }
  })

  return (
    <View style={{ height: ITEM_HEIGHT, overflow: "hidden" }}>
      <Animated.FlatList
        data={images}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={"fast"}
        pagingEnabled
        onScroll={onScroll}
        renderItem={({ item }: any) => {
          return (
            <View>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          );
        }}
      />
      <View style={styles.pagination}>
        {images.map((_, index) => {
          return <View key={index} style={[styles.dot]} />;
        })}
        <Animated.View style ={[styles.indicator,animatedIndicatorStyle]}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  pagination: {
    position: "absolute",
    top: 100,
    left: 10,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    backgroundColor: "#333",
    marginBottom: DOT_SIZE,
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE,
    borderWidth: 1,
    borderColor: '#333',
    position : 'absolute',
    left : -DOT_SIZE/2,
    top : -DOT_SIZE/2,
    // left : -

  },
});
export default FlatListCarousel;
