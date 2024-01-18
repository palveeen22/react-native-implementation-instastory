import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { font } from '../../theme'
import CheckBox from './CheckBox'
import RadioButton from './RadioButton'
import Switch from './Switch'

interface Props {
  style?: ViewStyle | ViewStyle[]
  type?: 'radiobutton' | 'checkbox' | 'switch'
  leftText?: string
  rightText?: string
  onChange: (checked: boolean) => void
  selected: boolean
  count?: number
  disabled?: boolean
}

export default (props: Props) => {
  const { style, type, selected, leftText, rightText, onChange, count, disabled } = props
  const { colors } = useTheme()

  let selector = null
  switch (type) {
    case 'checkbox': {
      selector = <CheckBox disabled={disabled} checked={selected} onChange={onChange} />
      break
    }
    case 'switch': {
      selector = <Switch disabled={disabled} checked={selected} onChange={onChange} />
      break
    }
    default:
      selector = <RadioButton disabled={disabled} checked={selected} onChange={onChange} />
  }

  return (
    <Pressable disabled={disabled} style={[styles.container, style]} onPress={() => onChange(!selected)}>
      {!!leftText && <Text style={[styles.text, styles.leftText, { color: colors.switch.text }]}>{leftText}</Text>}
      {selector}
      {!!rightText && (
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.text,
              styles.rightText,
              {
                color: disabled ? colors.switch.count : colors.switch.text,
                flex: count === undefined ? 1 : 0,
              },
            ]}
          >
            {rightText}
          </Text>
          {count !== undefined && <Text style={[styles.count, { color: colors.switch.count }]}>({count})</Text>}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
  count: {
    marginLeft: 5,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
  leftText: {
    marginRight: 12,
  },
  rightText: {
    marginLeft: 12,
  },
})
