import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useReducer, useRef } from "react";
import { Entypo, Feather } from "@expo/vector-icons";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length: number) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const data = [...Array(20).keys()].map((_, _index: any) => ({
  key: _index + 5,
  job: `${generateString(_index)}`,
}));

const _colors = {
  active: `#FCD259ff`,
  inactive: `#FCD25900`,
};

const { width, height } = Dimensions.get("screen");
const _spacing = 10;

const ScrollIndex = () => {
  const [index, setIndex] = React.useState(0);
  const [viewPosition, setViewPosition] = React.useState(0);
  const ref = useRef<FlatList>(null);

  React.useEffect(() => {
    ref?.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: viewPosition,
      viewOffset: _spacing,
    });
  }, [index]);

  //

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        style={{ flexGrow: 0 }}
        data={data}
        ref={ref}
        initialScrollIndex={index}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingLeft: _spacing }}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ index: _index, item }: any) => {
          return (
            <TouchableOpacity onPress={() => {}}>
              <View
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      _index === index ? _colors.active : _colors.inactive,
                  },
                ]}
              >
                <Text style={{ color: "#36303F", fontWeight: "700" }}>
                  {item.job}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          marginTop: _spacing * 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "#36303F",
              fontWeight: "700",
              marginBottom: _spacing,
            }}
          >
            Scroll position
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: width / 2,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setViewPosition(0);
              }}
            >
              <View style={styles.icons}>
                <Entypo name="align-left" size={24} color="#36303F" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setViewPosition(0.5);
              }}
            >
              <View style={styles.icons}>
                <Entypo
                  name="align-horizontal-middle"
                  size={24}
                  color="#36303F"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setViewPosition(1);
              }}
            >
              <View style={styles.icons}>
                <Entypo name="align-right" size={24} color="#36303F" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{ color: "#36303F", fontWeight: "700", marginBottom: 10 }}
          >
            Navigation
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: width / 2,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (index !== 0) {
                  setIndex((prev) => prev - 1);
                }
              }}
            >
              <View style={styles.icons}>
                <Feather name="arrow-left" size={24} color="#36303F" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (index !== data.length - 1) {
                  setIndex((prev) => prev + 1);
                }
              }}
            >
              <View style={styles.icons}>
                <Feather name="arrow-right" size={24} color="#36303F" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScrollIndex;

const styles = StyleSheet.create({
  item: {
    marginRight: _spacing,
    padding: _spacing,
    borderWidth: 2,
    borderColor: _colors.active,
    borderRadius: 12,
    backgroundColor: _colors.inactive,
  },
  icons: {
    padding: _spacing,
    backgroundColor: "#FCD259",
    borderRadius: _spacing,
    marginRight: _spacing,
  },
});
