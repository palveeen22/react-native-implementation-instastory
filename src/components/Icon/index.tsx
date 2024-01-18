import { useTheme } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import { SvgXml } from 'react-native-svg'
import icons from './icons'

export type IconsType = keyof typeof icons

interface hitSlopProps {
  top: number
  bottom: number
  left: number
  right: number
}
const HIT_SLOP_AREA = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
}
interface IconProps {
  disabled?: boolean
  isVisible?: boolean
  size?: number
  color?: string
  name: IconsType
  style?: ViewStyle | ViewStyle[]
  backgroundColor?: string
  onPress?: () => void
  testID?: string
  hitSlopArea?: hitSlopProps
}

export default function Icon(props: IconProps) {
  const { colors } = useTheme()
  const {
    style,
    name,
    size = 24,
    color = colors.icon.default,
    onPress,
    isVisible = true,
    disabled,
    testID,
    hitSlopArea = HIT_SLOP_AREA,
  } = props
  if (!isVisible) {
    return null
  }

  const onPressHandler = !!onPress && !disabled ? () => onPress() : undefined

  const drawIcon = (includeStyle: boolean) => (
    <SvgXml
      testID={testID}
      style={includeStyle ? style : undefined}
      xml={icons[name](
        size,
        disabled ? colors.icon.disabled : color,
        name === 'filter' ? colors.icon.topRight2 : undefined
      )}
      width={size}
      height={size}
    />
  )

  if (icons[name]) {
    if (onPressHandler) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={hitSlopArea}
          onPress={onPressHandler}
          style={style}
          disabled={disabled}
        >
          {drawIcon(false)}
        </TouchableOpacity>
      )
    } else {
      return drawIcon(true)
    }
  }
  return null
}
