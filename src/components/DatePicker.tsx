import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import DatePicker from 'react-native-date-picker'

interface DatePickerProps {
  style?: ViewStyle | ViewStyle[]
  modal?: boolean
  mode?: 'date' | 'time' | 'datetime'
  isVisible: boolean
  date: Date
  minimumDate?: Date
  maximumDate?: Date
  onConfirm: (datetime: Date) => void
  onCancel: () => void
  locale?: string
  confirmText?: string
  cancelText?: string
  title
}

export default function ({
  style,
  modal,
  mode = 'date',
  isVisible,
  date = new Date(),
  minimumDate,
  maximumDate,
  onConfirm,
  onCancel,
  locale,
  confirmText,
  cancelText,
  title,
}: DatePickerProps) {
  const { dark, colors } = useTheme()

  return (
    <DatePicker
      style={style}
      modal={modal}
      mode={mode}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      open={isVisible}
      date={date}
      onConfirm={onConfirm}
      onCancel={onCancel}
      locale={locale}
      confirmText={confirmText}
      cancelText={cancelText}
      title={title}
      textColor={colors.text.default}
    />
  )
}

const styles = StyleSheet.create({})
