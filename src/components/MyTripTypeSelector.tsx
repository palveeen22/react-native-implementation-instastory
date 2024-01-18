import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { t } from '../localization'
import { font } from '../theme'

interface MyTripTypeSelectorProps {
  style?: ViewStyle | ViewStyle[]
  isPublished: boolean
  onChange: (value: boolean) => void
}

export default function (props: MyTripTypeSelectorProps) {
  const { style, isPublished, onChange } = props

  return (
    <View style={[styles.container, style]}>
      <Button text={t('published')} isActive={isPublished} onPress={() => onChange(true)} />
      <Button text={t('booked')} isActive={!isPublished} onPress={() => onChange(false)} />
    </View>
  )
}

function Button({ text, isActive, onPress }: { text: string; isActive: boolean; onPress: () => void }) {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      style={[
        styles.switcherLineView,
        {
          borderBottomColor: isActive
            ? colors.myTripTypeSelector.activeBorder
            : colors.myTripTypeSelector.inactiveBorder,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.switcherText,
          {
            color: isActive ? colors.myTripTypeSelector.activeText : colors.myTripTypeSelector.inactiveText,
            fontFamily: isActive ? font(500) : font(400),
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  switcherLineView: {
    width: '50%',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  switcherText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
  },
})
