import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

interface BadgeProps {
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
  count: number | string
  hideZero?: boolean
}

export default function ({ style, count, hideZero = true, textStyle }: BadgeProps) {
  const { dark, colors } = useTheme()

  if (count === null || count === undefined || (count === 0 && hideZero)) {
    return null
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.badge.backgroud }, style]}>
      <Text style={[styles.text, { color: colors.badge.text }, textStyle]} numberOfLines={1}>
        {count}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 15,
    paddingVertical: 0,
    paddingHorizontal: 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    lineHeight: 15,
  },
})
