import React, { ReactElement, useState, useRef, useEffect } from 'react'
import { Animated, StyleSheet, View, ViewStyle } from 'react-native'
import config from '../config'

interface ExpandableProps {
  isOpen: boolean
  header?: ReactElement<any, any>
  children: ReactElement<any, any>
  style?: ViewStyle | ViewStyle[]
}

export default function Expandable({ isOpen, children, style, header }: ExpandableProps) {
  const [layoutHeight, setLayoutHeight] = useState(0)
  const value = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(value, {
      toValue: isOpen ? layoutHeight : 0,
      duration: config.animationDuration,
      useNativeDriver: false,
    }).start()
  }, [isOpen])

  const height = value.interpolate({
    inputRange: [0, layoutHeight],
    outputRange: [0, layoutHeight],
  })

  return (
    <View style={[styles.container, style]}>
      {header}
      <Animated.View style={{ height, overflow: 'hidden' }}>
        <View
          style={styles.contentContainer}
          onLayout={(e) => {
            if (isOpen) {
              value.setValue(e.nativeEvent.layout.height)
            }
            setLayoutHeight(e.nativeEvent.layout.height)
          }}
          testID={'Expandable_Content'}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
})
