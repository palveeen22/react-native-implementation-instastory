import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useState, useEffect, useRef } from 'react'

interface AdditionalProps {
  inactiveBackgroundColor: string
  activeBackgroundColor: string
  inactiveTintColor: string
  activeTintColor: string
  tabBarHide: string
  options: {
    tabBarVisible: boolean
  }
  style: Object[]
}
interface BottomTabProps {
  props: BottomTabBarProps & AdditionalProps
}

const MyTabBar: React.FC = () => {
  const [showTabBar, setShowTabBar] = useState<boolean>(false)
  const [layout, setLayout] = useState<Nullable<LayoutRectangle>>(null)
  const routes = Object.values(props.descriptors)
  const tabBarPosition = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (layout) {
      Animated.timing(tabBarPosition, {
        toValue: !showTabBar ? Math.abs(layout.y) + layout.height : 0,
        duration: config.animationDuration,
        useNativeDriver: true,
      }).start()
    }
  }, [layout, showTabBar, tabBarPosition])
  return (
    <Animated.View
      style={[props.style, styles.wrapper, { transform: [{ translateY: tabBarPosition }] }]}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <View style={{ flexDirection: 'row' }}>
        {props.state.routes.map((route, index) => {
          const { options } = props.descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = props.state.index === index
          const iconColor = isFocused ? props.activeTintColor : props.inactiveTintColor
          const backgroundColor = isFocused ? props.activeBackgroundColor : props.inactiveBackgroundColor

          const onPress = () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              props.navigation.navigate({ name: route.name, merge: true })
            }
          }

          const onLongPress = () => {
            props.navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <TouchableOpacity
              key={index.toString()}
              style={[styles.icon, { backgroundColor }]}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {options?.tabBarIcon({
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    paddingVertical: 16,
  },
})
