import { useTheme } from '@react-navigation/native'
import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Icon, Modal } from '.'
import { t } from '../localization'
import { font } from '../theme'
import { CarColorType, Nullable } from '../types'

interface ColorPickerProps {
  style?: ViewStyle | ViewStyle[]
  colors: Nullable<CarColorType[]>
  value: Nullable<CarColorType>
  onSelect: (color: CarColorType) => void
}

export default function ({ style, colors: colorsList, onSelect, value }: ColorPickerProps) {
  const { dark, colors } = useTheme()

  const [showColorsModal, setShowColorsModal] = useState<boolean>(false)

  const onCarColorPress = useCallback((color: CarColorType) => {
    onSelect(color)
    setShowColorsModal(false)
  }, [])

  function onModalClose() {
    setShowColorsModal(false)
  }

  return (
    <View style={style}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.textInput.background }]}
        activeOpacity={1}
        onPress={() => setShowColorsModal(true)}
      >
        {value ? (
          <ListItem item={value} onPress={() => setShowColorsModal(true)} />
        ) : (
          <Text style={[styles.text, { color: colors.text.placeholder }]}>{t('color')}</Text>
        )}
        <Icon name={'dropdown'} color={colors.icon.secondary} />
      </TouchableOpacity>
      <Modal style={{ paddingVertical: 0 }} isVisible={showColorsModal} onClose={onModalClose} closeButton={false}>
        {colorsList?.map((color, index) => (
          <ListItem
            key={index.toString()}
            style={[
              styles.item,
              {
                borderTopWidth: index ? 1 : 0,
                borderColor: colors.border,
              },
            ]}
            item={color}
            onPress={() => onCarColorPress(color)}
          />
        ))}
      </Modal>
    </View>
  )
}
interface ListItemProps {
  item: CarColorType
  onPress?: () => void
  style?: ViewStyle | ViewStyle[]
}

function ListItem(props: ListItemProps): React.JSX.Element {
  const { colors } = useTheme()
  const { item, onPress, style } = props

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={[styles.itemContainer, style]}>
      <View style={[styles.color, { backgroundColor: item.color_code }]} />
      <Text style={[styles.text, { color: colors.text.default }]}>{item?.label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flex: 1,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  item: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 40,
    alignItems: 'center',
  },
  color: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    flex: 1,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
})
