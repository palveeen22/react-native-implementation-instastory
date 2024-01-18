import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, ImageStyle, StyleSheet } from 'react-native'
import { WelcomeDark, WelcomeLight } from '../localization/images'

interface SearchTripsEmptyImageProps {
  style?: ImageStyle | ImageStyle[]
}

export default function (props: SearchTripsEmptyImageProps) {
  const { dark, colors } = useTheme()
  const { style } = props

  return (
    <Image
      style={[styles.image, style]}
      source={dark ? WelcomeDark : WelcomeLight}
      resizeMode={'contain'}
      resizeMethod={'scale'}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 268,
    height: 196,
    alignSelf: 'center',
  },
})
