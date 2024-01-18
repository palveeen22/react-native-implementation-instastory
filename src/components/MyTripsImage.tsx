import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, ImageStyle, StyleSheet } from 'react-native'
import { MyTripsDark, MyTripsLight } from '../localization/images'

interface MyTripsImageProps {
  style?: ImageStyle | ImageStyle[]
}

export default function ({ style }: MyTripsImageProps) {
  const { dark, colors } = useTheme()

  return (
    <Image
      source={dark ? MyTripsDark : MyTripsLight}
      style={[styles.image, style]}
      resizeMethod={'scale'}
      resizeMode={'contain'}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  image: {
    width: 182,
    height: 124,
  },
})
