import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet, View, ViewStyle } from 'react-native'
import { Icon } from '.'
import { isSmallScreen } from '../theme'
import { CarType, UserProfile } from '../types'

interface AvatarProps {
  style?: ViewStyle | ViewStyle[]
  car?: CarType
  profile?: UserProfile
  backgroundColor?: string
  tintColor?: string
  iconSize?: number
}

export default function (props: AvatarProps) {
  const { dark, colors } = useTheme()
  const {
    style,
    car,
    profile,
    backgroundColor = colors.avatar.background,
    tintColor = colors.icon.action,
    iconSize = isSmallScreen() ? 18 : 22,
  } = props

  if (!car && !profile) {
    return null
  }

  const uri = car?.photo?.url || profile?.photo

  return (
    <View style={[styles.container, style]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode={'cover'} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor }]}>
          <Icon name={car ? 'car' : 'user2'} size={iconSize} color={tintColor} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: isSmallScreen() ? 40 : 48,
    height: isSmallScreen() ? 40 : 48,
    borderRadius: isSmallScreen() ? 20 : 24,
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
})
