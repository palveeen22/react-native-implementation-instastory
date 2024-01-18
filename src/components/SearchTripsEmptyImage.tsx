import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, ImageStyle, StyleSheet } from 'react-native'
import { SearchTripsEmptyDark, SearchTripsEmptyLight } from '../localization/images'

interface SearchTripsEmptyImageProps {
  style?: ImageStyle | ImageStyle[]
}

export default function (props: SearchTripsEmptyImageProps) {
  const { dark, colors } = useTheme()
  const { style } = props

  return (
    <Image
      style={[styles.image, style]}
      source={dark ? SearchTripsEmptyDark : SearchTripsEmptyLight}
      resizeMode={'contain'}
      resizeMethod={'scale'}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 170,
    alignSelf: 'center',
  },
})
