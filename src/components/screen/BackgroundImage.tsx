import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { BackgroundDark, BackgroundLight } from '../../localization/images'
import { metrics } from '../../theme'
import { Nullable } from '../../types'

export interface BackGroundImageProps {
  offset?: Nullable<number>
  height?: Nullable<number>
}

export default function (props: BackGroundImageProps) {
  const { dark } = useTheme()
  const { offset, height = 0 } = props
  const image = dark ? BackgroundDark : BackgroundLight
  const [imageHeight, setImageHeight] = useState<null | number>(null)

  let repeatCount = Math.ceil(height / imageHeight)
  repeatCount = Number.isFinite(repeatCount) ? repeatCount : 0
  const repeat: number[] = repeatCount > 0 ? Array.from(Array(repeatCount).keys()) : []

  return (
    <View style={[styles.container, { top: offset === null || offset === undefined ? 0 : -offset }]}>
      <Image style={styles.image} source={image} onLayout={(e) => setImageHeight(e.nativeEvent.layout.height)} />
      {repeat.map((count) => (
        <Image key={count.toString()} style={styles.image} source={image} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: metrics.screenWidth,
  },
})
