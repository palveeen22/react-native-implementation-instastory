import React, { useEffect } from 'react'
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import { useState } from 'react'

import { font, metrics } from '../theme'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { useTheme } from '@react-navigation/native'
import { t } from '../localization'

const CELL_COUNT = 4

type DefaultComponentProps = {
  onCodeEntered: (code: string) => void
  editable?: boolean
  style?: ViewStyle | ViewStyle[]
  error?: boolean
  onChange?: (value: string) => void
}

const CodeInput: React.FunctionComponent<DefaultComponentProps> = (props: DefaultComponentProps) => {
  const { colors } = useTheme()
  const [value, setValue] = useState('')
  const { onCodeEntered, style, editable, error, onChange } = props
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [codeFiledProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  const handleCodeFinished = () => {
    onCodeEntered && onCodeEntered(value)
    setValue('')
  }

  useEffect(() => {
    if (value) {
      onChange && onChange(value)
    }
  }, [value])

  return (
    <View style={[, style]}>
      <CodeField
        ref={ref}
        {...codeFiledProps}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        onEndEditing={handleCodeFinished}
        autoFocus
        editable={editable}
        rootStyle={styles.field}
        keyboardType='number-pad'
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[
              styles.cell,
              {
                backgroundColor: colors.codeInput.background,
                borderColor: error ? colors.error.default : colors.codeInput.border,
              },
              (isFocused || error) && styles.focused,
            ]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text style={[styles.value, { color: error ? colors.error.default : colors.codeInput.text }]}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      {error && <Text style={[styles.error, { color: colors.error.default }]}>{t('code_error')}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    justifyContent: 'flex-start',
  },
  cell: {
    width: metrics.screenWidth < 375 ? 55 : 80,
    height: metrics.screenWidth < 375 ? 55 : 80,
    marginRight: 5,
    borderRadius: 5,
    textAlignVertical: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  value: {
    fontFamily: font(),
    fontSize: 16,
    lineHeight: 24,
    overflow: 'hidden',
  },
  focused: {
    borderBottomWidth: 2,
  },
  error: {
    marginTop: 16,
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  } as TextStyle,
})

export default CodeInput
