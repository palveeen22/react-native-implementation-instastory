import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

export interface RadioButtonProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function RadioButton({ checked, onChange, disabled }: RadioButtonProps) {
  const { colors } = useTheme()

  return (
    <Pressable
      disabled={disabled}
      style={[styles.container, { borderColor: colors.switch.radiobutton.inactive }]}
      onPress={() => !!onChange && onChange(!checked)}
    >
      {checked && <View style={[styles.innerButton, { backgroundColor: colors.switch.radiobutton.active }]} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButton: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
})
