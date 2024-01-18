import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect, useCallback } from 'react'
import { TouchableOpacity, Text, ViewStyle, StyleSheet, TextStyle, View } from 'react-native'
import { ButtonsType, font } from '../theme'
// @ts-ignore
import _ from 'lodash'
import { Icon } from '.'

export type ButtonType = keyof ButtonsType

interface ButtonProps {
  text?: string
  onPress?: () => void
  style?: ViewStyle | ViewStyle[]
  disabled?: boolean
  type?: ButtonType
  fetching?: boolean
  icon?: 'prevStep' | 'nextStep' | 'plus_small' | 'minus_small'
  textStyle?: TextStyle | TextStyle[]
}

export default function Button({
  text,
  onPress,
  style,
  disabled,
  type = 'primary',
  fetching,
  icon,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme()
  const [pressed, setPressed] = useState(false)
  let isCancelled = false

  useEffect(
    () => () => {
      isCancelled = true
    },
    []
  )

  useEffect(() => {
    if (!fetching && !isCancelled) {
      callback()
    }
  }, [fetching])

  const callback = useCallback(
    _.debounce(() => {
      !isCancelled && setPressed(false)
    }, 1000),
    []
  )

  const buttonType = disabled || pressed ? 'disabled' : type

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.button[type].background,
          borderColor: colors.button[type].border,
        },
        !icon
          ? styles.container
          : [
            styles.iconContainer,
            {
              shadowColor: colors.shadow,
              height: type === 'bordered' ? styles.iconContainer.height - 2 : styles.iconContainer.height,
              borderWidth: type === 'bordered' ? 1 : undefined,
              borderColor: colors.button[buttonType].icon,
            },
          ],
        style,
      ]}
      onPress={
        onPress
          ? () => {
            if (fetching !== undefined) {
              setPressed(true)
            }
            onPress()
          }
          : null
      }
      disabled={disabled || pressed || fetching}
    >
      {icon ? (
        <Icon name={icon} color={colors.button[buttonType].icon} size={15} />
      ) : (
        <Text
          style={[
            { color: colors.button[buttonType].text },
            styles.text,
            type === 'primary' ? styles.primaryFont : styles.secondaryFont,
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
      {buttonType === 'disabled' && <View style={[styles.opacity, { backgroundColor: 'white', borderRadius: 10 }]} />}
    </TouchableOpacity>
  )
}

const commonStyles = {
  button: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.button,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    minHeight: 58,
    borderWidth: 1,
  },
  iconContainer: {
    ...commonStyles.button,
    width: 45,
    height: 45,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  primaryFont: {
    fontFamily: font('bold'),
  },
  secondaryFont: {
    fontFamily: font(),
  },
  fetching: {
    marginLeft: 10,
  },
  opacity: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    zIndex: 1,
    opacity: 0.4,
  } as ViewStyle,
})
