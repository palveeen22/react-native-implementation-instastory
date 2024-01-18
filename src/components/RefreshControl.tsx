import { useTheme } from '@react-navigation/native'
import React from 'react'
import { ViewStyle, RefreshControl } from 'react-native'

interface RefreshControlProps {
  style?: ViewStyle | ViewStyle[]
  refreshing: boolean
  onRefresh: () => void
}

export default function ({ style, refreshing, onRefresh }: RefreshControlProps) {
  const { dark, colors } = useTheme()

  return <RefreshControl style={style} refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.fetching} />
}
