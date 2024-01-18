import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, ImageStyle, StyleSheet } from 'react-native'
import { BookingSuccessLight, BookingSuccessDark } from '../localization/images'

interface BookingSuccessImageProps {
  style?: ImageStyle | ImageStyle[]
}

export default function ({ style }: BookingSuccessImageProps) {
  const { dark, colors } = useTheme()

  return (
    <Image
      style={[styles.image, style]}
      source={dark ? BookingSuccessDark : BookingSuccessLight}
      resizeMode={'contain'}
      resizeMethod={'scale'}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    height: 158,
    width: 223,
    alignSelf: 'center',
  },
})
