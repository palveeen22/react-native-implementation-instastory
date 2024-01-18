import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native'
import { SuggestType } from '.'
import { font } from '../../theme'
import { SvgUri } from 'react-native-svg'

interface Props {
  style?: ViewStyle | ViewStyle[]
  item: SuggestType
  onPress: () => void
  isCountry?: boolean
}

export default function (props: Props) {
  const { colors } = useTheme()
  const { style, item, onPress, isCountry } = props

  return (
    <Pressable style={[styles.container, { borderColor: colors.textInput.background }, style]} onPress={onPress}>
      {isCountry ? <SvgUri uri={`https://xn--90aagsb.xn--p1ai/${item?.url_logo}`} width={20} height={20} /> : <></>}
      <Text style={[styles.text, { color: colors.text.default }]}>{item._name_}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
  },
  text: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
})
