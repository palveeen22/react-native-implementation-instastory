import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useState, useRef, useEffect } from 'react'
import { LayoutRectangle, StyleSheet, TouchableOpacity, View, Platform } from 'react-native'
import { Nullable } from '../types'
import Animated, { withTiming, useSharedValue } from 'react-native-reanimated'
import DeviceInfo from 'react-native-device-info';

interface AdditionalProps {
  inactiveBackgroundColor: string
  activeBackgroundColor: string
  inactiveTintColor: string
  activeTintColor: string
  tabBarHide: string
  options: {
    tabBarVisible: boolean
  }
  descriptors: Object
  style: Object[]
}
interface BottomTabProps {
  props: BottomTabBarProps & AdditionalProps
}

export default function ({ props }: BottomTabProps) {
  const [showTabBar, setShowTabBar] = useState<boolean>(false)
  const [layout, setLayout] = useState<Nullable<LayoutRectangle>>(null)
  const routes = Object.values(props.descriptors)
  const tabBarPosition = useSharedValue(0)

  useEffect(() => {
    if (layout) {
      tabBarPosition.value = showTabBar ? withTiming(0) : withTiming(Math.abs(layout.y) + layout.height)
    }
  }, [layout, showTabBar, tabBarPosition])

  const isiPhoneXOrNewer = DeviceInfo.hasNotch();
  const isAndroid = Platform.OS === 'android'
  const hasNothc = !isAndroid && isiPhoneXOrNewer

  return (
    <Animated.View
      style={[props.style, styles.wrapper, { transform: [{ translateY: tabBarPosition }] }]}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: props.inactiveBackgroundColor },
        ]}
      >
        {routes.map((route, index) => {
          const isFocused = route.navigation.isFocused()
          const tabBarVisible = route.options?.tabBarVisible === undefined ? true : route?.options?.tabBarVisible
          const iconColor = isFocused ? props.activeTintColor : props.inactiveTintColor
          const backgroundColor = isFocused ? props.activeBackgroundColor : props.inactiveBackgroundColor

          const onRoutePress = (index: number) => {
            const routeName = props.state.routes[index].name
            props.navigation.navigate(routeName)
          }

          if (!isFocused && showTabBar !== tabBarVisible) {
            setShowTabBar(tabBarVisible)
          }

          return (
            <TouchableOpacity
              key={index.toString()}
              style={[hasNothc ? { ...styles.icon, paddingBottom: 40 } : styles.icon, { backgroundColor }]}
              onPress={() => onRoutePress(index)}
            >
              {route.options.tabBarIcon({
                focused: isFocused,
                color: iconColor,
                size: undefined,
              })}
            </TouchableOpacity>
          )
        })}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    bottom: 0,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
})
