import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
} from "react-native";

const api = "https://picsum.photos/v2/list?page=2&limit=100";

const { height, width } = Dimensions.get("window");

const IMAGE_SIZE = 80;
const SPACING = 10;
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

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={images}
        ref={flatListRef1}
        keyExtractor={(item) => item?.id.toString()}
        horizontal
        onMomentumScrollEnd={(ev) => {
          updateActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
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
                  borderColor: index === activeIndex ? "#fff" : "transparent",
                  borderWidth: 2,
                }}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({});

export default FlatListGallery;
