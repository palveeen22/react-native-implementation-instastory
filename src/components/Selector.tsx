import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Icon, IconsType } from '.'
import { font } from '../theme'

interface SelectorProps {
  style?: ViewStyle | ViewStyle[]
  onPress: () => void
  text?: string
  selected?: boolean
  icon?: IconsType
  iconSize?: number
  textStyle?: TextStyle | TextStyle[]
}

export default function ({ style, onPress, text, selected = false, icon, iconSize = 24, textStyle }: SelectorProps) {
  const { dark, colors } = useTheme()

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: selected ? colors.selector.activeBorder : colors.selector.inactiveBorder,
          backgroundColor: selected ? colors.selector.activeBackground : colors.selector.inactiveBackground,
          borderRadius: 10,
        },
        style,
      ]}
      onPress={onPress}
    >
      {!!icon && (
        <Icon
          name={icon}
          style={styles.icon}
          size={iconSize}
          color={selected ? colors.selector.activeIcon : colors.selector.inactiveIcon}
        />
      )}
      <Text
        style={[
          styles.text,
          selected && !icon && styles.textSelected,
          {
            color: selected || !!icon ? colors.selector.activeText : colors.selector.inactiveText,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  } as ViewStyle,
  text: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
  textSelected: {
    fontFamily: font(600),
  } as TextStyle,
})
