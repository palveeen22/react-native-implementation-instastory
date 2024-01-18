import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Icon } from '..'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default (props: Props) => {
  const { checked, onChange, disabled } = props
  const { colors } = useTheme()

  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.container,
        {
          borderColor: checked ? colors.switch.checkBox.active : colors.switch.checkBox.inactive,
          backgroundColor: checked ? colors.switch.checkBox.active : undefined,
        },
      ]}
      onPress={() => !!onChange && onChange(!checked)}
    >
      {checked && <Icon name={'checkBoxCheck'} color={colors.switch.checkBox.checked} size={24} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
