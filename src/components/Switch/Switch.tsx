import React from 'react'
import { useTheme } from '@react-navigation/native'
import { Switch as RNSwitch } from 'react-native-switch'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Switch({ checked, onChange, disabled }: SwitchProps) {
  const { colors } = useTheme()

  return (
    <RNSwitch
      disabled={disabled}
      value={checked}
      onValueChange={(value) => onChange(value)}
      renderActiveText={false}
      renderInActiveText={false}
      barHeight={24}
      circleSize={24}
      circleBorderWidth={2}
      backgroundInactive={colors.switch.switch.trackInactive}
      backgroundActive={colors.switch.switch.trackActive}
      innerCircleStyle={{
        backgroundColor: checked ? colors.switch.switch.toggleActive : colors.switch.switch.toggleInactive,
        borderColor: checked ? colors.switch.switch.trackActive : colors.switch.switch.trackInactive,
      }}
      switchWidthMultiplier={2}
      switchLeftPx={2}
      switchRightPx={2}
    />
  )
}
