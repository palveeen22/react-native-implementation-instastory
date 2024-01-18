import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Icon, IconsType } from '.'
import { t } from '../localization'
import { font } from '../theme'

interface TripComfortItemProps {
  style?: ViewStyle | ViewStyle[]
  type: 'babyChair' | 'max2seat' | 'cargo' | 'delivery' | 'animals' | 'smoke'
  value: boolean
}

export default function ({ style, type, value }: TripComfortItemProps) {
  if (['babyChair', 'max2seat', 'delivery'].includes(type) && !value) {
    return null
  }
  const { dark, colors } = useTheme()

  let text = null
  let icon: IconsType = null
  switch (type) {
    case 'babyChair': {
      text = t('has_baby_chair')
      icon = 'baby'
      break
    }
    case 'max2seat': {
      text = t('max_2_behind')
      icon = 'behind2seat'
      break
    }
    case 'delivery': {
      text = t('ready_take_delivery')
      icon = 'delivery'
      break
    }
    case 'animals': {
      text = t(value ? 'allow_animals' : 'disallow_animals')
      icon = 'animals'
      break
    }
    case 'cargo': {
      text = t(value ? 'allow_cargo' : 'disallow_cargo')
      icon = 'cargo'
      break
    }
    case 'smoke': {
      text = t(value ? 'allow_smoke' : 'disallow_smoke')
      icon = 'smoke'
      break
    }
  }
  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} color={value ? colors.tripComfortItem.activeIcon : colors.tripComfortItem.inactiveIcon} />
      <Text
        style={[
          styles.text,
          {
            color: value ? colors.tripComfortItem.activeText : colors.tripComfortItem.inactiveText,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  icon: {},
  text: {
    marginLeft: 12,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
})
