import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";

const api = "https://picsum.photos/v2/list?page=2&limit=100";

const { height, width } = Dimensions.get("window");

const IMAGE_SIZE = 80;
const SPACING = 10;

const data = [
  "https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200",
];

const imageW = width * 0.7;
const imageH = imageW * 1.54;

const FlatListGallery = () => {
  const [images, setImages] = React.useState([]);

  const fetchImagesFromPicsum = async () => {
    const res = await fetch(api);
    const images = await res.json();
    console.log("imagges====", images);
    setImages(images.slice(0, 10));
  };

  useEffect(() => {
    fetchImagesFromPicsum();
  }, []);

  const flatListRef1 = React.useRef<FlatList>();
  const flatListRef2 = React.useRef<FlatList>();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const updateActiveIndex = (index) => {
    //
    setActiveIndex(index);
    flatListRef1?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      flatListRef2?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    }
  };
  const IMAGE_WIDTH = React.useMemo(() => (
    width * .7
  ), [width]);

  const IMAGE_HEIGHT = React.useMemo(() => (
    IMAGE_WIDTH * 1.54
  ), [IMAGE_WIDTH]);

  const carasoul = true;

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={{ flex: 1 }}>
      {carasoul ? (
        <>
          <View style={StyleSheet.absoluteFillObject}>
            <FlatList
              data={data}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              renderItem={({item, index}) => {

                const opacity = scrollX.interpolate({
                  inputRange: [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width
                  ],
                  outputRange: [0, 1, 0],
                })
      
                return (
                  <>
                    <View style={StyleSheet.absoluteFillObject}>
                      <Animated.Image
                        blurRadius={25}
                        source={{uri: item}}
                        style={[
                          StyleSheet.absoluteFillObject,
                          {opacity}
                        ]} />
                    </View>
                    <View style={{
                      width,
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Animated.Image
                        style={{
                          width: IMAGE_WIDTH,
                          height: IMAGE_HEIGHT,
                          resizeMode: 'cover',
                          borderRadius: 16,
                          opacity
                        }}
                        source={{uri: item}} />
                    </View>
                  </>
                )
              }}
            />
          </View>
        </>
      ) : (
        <>
          <FlatList
            data={images}
            ref={flatListRef1}
            keyExtractor={(item) => item?.id.toString()}
            horizontal
            onMomentumScrollEnd={(ev) => {
              updateActiveIndex(
                Math.floor(ev.nativeEvent.contentOffset.x / width)
              );
            }}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View style={{ height, width }}>
                  <Image
                    source={{ uri: item?.download_url }}
                    style={StyleSheet.absoluteFillObject}
                  />
                </View>
              );
            }}
          />
          <FlatList
            data={images}
            keyExtractor={(item) => item?.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={flatListRef2}
            style={{ position: "absolute", bottom: IMAGE_SIZE }}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => updateActiveIndex(index)}>
                  <Image
                    source={{ uri: item?.download_url }}
                    style={{
                      width: IMAGE_SIZE,
                      height: IMAGE_SIZE,
                      borderRadius: 12,
                      marginRight: 12,
                      borderColor:
                        index === activeIndex ? "#fff" : "transparent",
                      borderWidth: 2,
                    }}
                  />
                </Pressable>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

const style = StyleSheet.create({});

export default FlatListGallery;
