import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

interface ColorProps {
  style?: ViewStyle | ViewStyle[]
  color: string
}

export default function ({ style, color }: ColorProps) {
  const { dark, colors } = useTheme()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          borderColor: colors.separator.default,
        },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
})
