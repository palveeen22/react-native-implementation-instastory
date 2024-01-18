import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { font, isSmallScreen } from '../theme'
import Selector from './Selector'

interface CounterProps {
  style?: ViewStyle | ViewStyle[]
  value: number
  onChange: (value: number) => void
}

export default function ({ style, value, onChange }: CounterProps) {
  const { dark, colors } = useTheme()

  return (
    <View style={[styles.container, style]}>
      <Selector style={styles.button} icon={'minus_small'} onPress={() => onChange(-1)} />
      <View style={styles.countContainer}>
        <Text style={[styles.count, { color: colors.text.default }]}>{value}</Text>
      </View>
      <Selector style={styles.button} icon={'plus_small'} selected onPress={() => onChange(1)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    minHeight: 45,
  },
  countContainer: {
    width: isSmallScreen() ? 58 : 79,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  },
})
