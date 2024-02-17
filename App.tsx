import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ColorPicker,
  Demo,
  PinchGesture,
  ScrollSlider,
  ToggleTheme,
  SwipeDelete,
  FList,
  SLideCount,
  AnimatedSkeleton,
  ScrollIndex,
  MotiCricle,
  FlatListGallery
} from "./Screens";

import { Clock, Segmented } from "./components";
import FlatListAnimatedtabs from "./Screens/ListAnimation/FlatListAnimatedtabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ScrollIndex"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Demo" component={Demo} />
          <Stack.Screen name="ToggleTheme" component={ToggleTheme} />
          <Stack.Screen name="PinchGesture" component={PinchGesture} />
          <Stack.Screen name="ScrollSlider" component={ScrollSlider} />
          <Stack.Screen name="ColorPicker" component={ColorPicker} />
          <Stack.Screen name="SwipeDelete" component={SwipeDelete} />
          <Stack.Screen name="FList" component={FList} />
          <Stack.Screen name="SLideCount" component={SLideCount} />
          <Stack.Screen name="AnimatedSkeleton" component={Segmented} />
          <Stack.Screen name="ScrollIndex" component={FlatListAnimatedtabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
