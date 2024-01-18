import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, ImageStyle, StyleSheet } from 'react-native'
import { RegistrationSuccessDark, RegistrationSuccessLight } from '../localization/images'

interface SearchTripsEmptyImageProps {
  style?: ImageStyle | ImageStyle[]
}

export default function (props: SearchTripsEmptyImageProps) {
  const { dark, colors } = useTheme()
  const { style } = props

  return (
    <Image
      style={[styles.image, style]}
      source={dark ? RegistrationSuccessDark : RegistrationSuccessLight}
      resizeMode={'contain'}
      resizeMethod={'scale'}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 221,
    height: 168,
    alignSelf: 'center',
  },
})
