import { View, Text, StyleSheet, FlatList, ViewToken } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const data = new Array(50).fill(0).map((_, index) => ({ id: index }));

const FList = () => {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingTop: 20 }}
        data={data}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          console.log("vItems" , vItems);
          viewableItems.value = vItems;
        }}
        renderItem={({ item }) => {
          return <ListItem viewableItems={viewableItems} item={item} />;
        }}
      />
    </View>
  );
};

type ItemProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  item: { id: number };
};

const ListItem: React.FC<ItemProps> = ({ viewableItems , item }) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(viewableItems.value.filter((item)=> item.isViewable).find((viewItem)=> viewItem.item.id === item.id ))
    return { opacity: withTiming(isVisible ? 1 : 0)  , transform : [{ scale : withTiming(isVisible ?  1  : 0.6) }] };
  });

  return <Animated.View style={[styles.item, rStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  item: {
    height: 70,
    width: "90%",
    backgroundColor: "green",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 14,
  },
});
export default FList;
