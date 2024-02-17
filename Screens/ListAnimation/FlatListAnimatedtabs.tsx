import React from "react";
import { View, Text, Image, Dimensions, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { transform } from "typescript";
const images = {
  man: "https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  women:
    "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  kids: "https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  skullcandy:
    "https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  help: "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
};
const { width, height } = Dimensions.get("screen");
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef(),
}));

const Tab = React.forwardRef(({ item ,onItemPress }: any, ref: any) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
    <View ref={ref}>
      <Text
        style={{ color: "white", fontSize: 16, textTransform: "capitalize" }}
      >
        {item?.title}
      </Text>
    </View>
    </TouchableOpacity>
  );
});

const Indicator = ({ measure, scrollX }: { measure: any[]; scrollX: any }) => {
  const inputRange = data.map((_, i) => i * width);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(scrollX.value, inputRange, measure.map((m)=> m.width)),
      transform : [{
         translateX : interpolate(scrollX.value ,inputRange  ,measure.map((m)=> m.x))
      }]
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          height: 4,
          width: measure[0].width,
          backgroundColor: "white",
          bottom: -10,
        },
        animatedStyle,
      ]}
    />
  );
};

const Tabs = ({ data, scrollX  , onItemPress }: { data: any[]; scrollX: any , onItemPress:any }) => {
  console.log("scrooll x in tab", scrollX?.value);

  const tabRef = React.useRef();
  const [measure, setMeasure] = React.useState([]);
  React.useEffect(() => {
    const m = [];
    data.forEach((item: any) => {
      console.log("item", item?.ref?.current?.measureLayout);
      if (item?.ref?.current && tabRef?.current) {
        item?.ref?.current?.measureLayout(
          tabRef?.current,
          (x, y, width, height) => {
            // console.log("measure count",left , top, width, height);
            m.push({ x, y, width, height });
            if (m.length === data.length) {
              setMeasure(m);
            }
          }
        );
      }
    });
  }, []);

  return (
    <View style={{ position: "absolute", top: 50, width }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          flex: 1,
        }}
        ref={tabRef}
      >
        {data.map((item , index) => {
          return <Tab key={item.key} item={item} ref={item?.ref}  onItemPress = {()=> onItemPress(index)}  />;
        })}
      </View>
      {measure.length ? (
        <Indicator measure={measure} scrollX={scrollX} />
      ) : null}
    </View>
  );
};

const FlatListAnimatedtabs = () => {
  const scrollX = useSharedValue(0);
  console.log("width", scrollX.value);
  const ref = useAnimatedRef<any>();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event, context) {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onItemPress = (index) =>{
    if(ref?.current){
      ref?.current?.scrollToOffset({ offset:  index * width  ,animated : true })
    }
    
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        ref={ref}
        onScroll={scrollHandler}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image source={{ uri: item?.image }} style={{ flex: 1 }} />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "rgba(0,0,0,0.3)" },
                ]}
              />
            </View>
          );
        }}
      />
      <Tabs data={data} scrollX={scrollX}  onItemPress = {onItemPress}  />
    </View>
  );
};

export default FlatListAnimatedtabs;
