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
  FlatListGallery,
  EasyAccordian,
  ParallaxCarousel,
  CounterScrollList,
  StickyFooter,
  FlatListCarousel,
  TransitionRoute,
} from "./Screens";
import { Clock, Segmented } from "./components";
import FlatListAnimatedtabs from "./Screens/ListAnimation/FlatListAnimatedtabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="FlatListCarousel"
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
          <Stack.Screen name="EasyAccordian" component={EasyAccordian} />
          <Stack.Screen name="ParallaxCarousel" component={ParallaxCarousel} />
          <Stack.Screen
            name="CounterScrollList"
            component={CounterScrollList}
          />
          <Stack.Screen name="StickyFooter" component={StickyFooter} />
          <Stack.Screen name="FlatListCarousel" component={FlatListCarousel} />
          <Stack.Screen name="TransitionRoute" component={TransitionRoute} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
