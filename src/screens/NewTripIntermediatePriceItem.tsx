import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, Pressable, ViewStyle, ImageStyle, TextStyle } from 'react-native'
import { IntermediateCityType } from '../types'
import { Icon, WaypointImage } from '../components'
import { useRoute, useTheme } from '@react-navigation/native'
import { font, ThemeColors } from '../theme'
import { ScreenStyles } from '../components'

interface RenderItemProps {
  item: IntermediateCityType
  index: number
  self: IntermediateCityType[]
  onPriceChange: (item: IntermediateCityType, price: number) => void
  priceStep: number
  currency: string
}

const RenderItem: React.FC<RenderItemProps> = ({ item, index, self, onPriceChange, priceStep, currency }) => {
  const colors: ThemeColors = useRoute().params?.colors
  const [height, setHeight] = useState<number>(0)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const priceRef = useRef<TextInput>(null)
  const { dark } = useTheme()

  if (!self || self.length <= 1 || index + 1 === self.length) {
    return null
  }
  const departure = item?.main_text
  const nextItem = self[index + 1]
  const destination = nextItem.main_text
  const price = nextItem.waypoint?.price

  const handleClearValue = () => {
    onPriceChange(nextItem, 0)
  }

  const formatNumber = (number) => {
    if (!number) {
      return ''
    }

    const numericValue = number.replace(/[^0-9]/g, '')

    let formattedNumber = ''
    let count = 0

    for (let i = numericValue.length - 1; i >= 0; i--) {
      formattedNumber = numericValue[i] + formattedNumber
      count++

      if (count === 3 && i > 0) {
        formattedNumber = ' ' + formattedNumber
        count = 0
      }
    }

    return formattedNumber
  }

  const handleChangeText = (newPrice: string) => {
    const hasSpace = newPrice.includes(' ')

    if (hasSpace) {
      onPriceChange(nextItem, +newPrice.split(' ').join(''))
    } else {
      onPriceChange(nextItem, +newPrice)
    }
  }

  const handlePriceEdit = () => {
    priceRef.current.focus()
    setIsFocused(true)
  }

  return (
    <View
      style={[styles.item.container, styles.marginHorizontal]}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      <View style={styles.item.waypoints.container}>
        <WaypointImage
          shape={'line'}
          height={height}
          tintColor={colors.waypointImage.visitedLine}
          zIndex={1}
          overflow={'hidden'}
        />
        <WaypointImage type={'firstPoint'} tintColor={colors.waypointImage.visitedLine} />
        <WaypointImage
          type={'lastPoint'}
          tintColor={colors.waypointImage.visitedLine}
          backgroundColor={colors.waypointImage.visitedLine}
        />
      </View>
      <View style={styles.item.city.container}>
        <Text style={[styles.item.city.name, { color: colors.text.default }]}>{departure}</Text>
        <Text style={[styles.item.city.name, { color: colors.text.default }]}>{destination}</Text>
      </View>
      <View style={styles.item.price.container}>
        <Pressable onPress={handlePriceEdit}>
          <View
            style={{
              borderWidth: 1,
              paddingLeft: 10,
              width: 130,
              height: 43,
              borderRadius: 30,
              borderColor: isFocused ? colors.textInput.borderActive : colors.textInput.borderInActive,
            }}
          >
            <View style={styles.element}>
              <TextInput
                ref={priceRef}
                style={{ width: 'auto', height: 40, color: dark ? '#FFFFFF' : '#2F2A2A' }}
                // style={{ borderWidth: 1, width: 55, height: 40, borderColor: "#F2F2F2" }}
                keyboardType='numeric'
                onChangeText={handleChangeText}
                value={formatNumber(`${price}`)}
                onFocus={handlePriceEdit}
                onEndEditing={() => setIsFocused(false)}
              />
              <Text style={{ color: dark ? '#FFFFFF' : '#2F2A2A' }}>{currency.toUpperCase()}</Text>
            </View>
            <Pressable onPress={handleClearValue} style={{ position: 'absolute', right: 15, top: 7.5 }}>
              <View
                style={{
                  borderWidth: 0.5,
                  width: 25,
                  height: 25,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: isFocused ? colors.text.default : colors.text.secondary,
                }}
              >
                <Icon
                  name='close'
                  size={20}
                  color={isFocused ? colors.textInput.borderActive : colors.text.secondary}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>

        {/*<Pressable
          style={[styles.item.price.button, { borderColor: colors.icon.secondary }]}
          onPress={() => onPriceChange(nextItem, (price || 0) - priceStep)}
        >
          <Icon name={'minus_large'} color={colors.icon.secondary} />
        </Pressable>
         <Text style={[styles.item.price.price, { color: colors.text.default }]}>
          {t('currency', [price, currency])}
        </Text>
        <Pressable
          style={[styles.item.price.button, { borderColor: colors.icon.secondary }]}
          onPress={() => {
            onPriceChange(nextItem, (price || 0) + priceStep);
          }}
        >
          <Icon name={'plus_large'} color={colors.icon.secondary} />
        </Pressable> */}
      </View>
    </View>
  )
}

const styles = {
  item: {
    container: {
      flexDirection: 'row',
    } as ViewStyle,
    separator: {
      borderTopWidth: 1,
      marginVertical: 18,
    } as ViewStyle,
    waypoints: {
      container: {
        width: 10,
      } as ViewStyle,
      circle: {} as ImageStyle,
      line: {} as ImageStyle,
    },
    city: {
      container: {
        marginLeft: 17,
        paddingTop: 4,
        flex: 1,
        justifyContent: 'space-between',
      } as ViewStyle,
      name: {
        fontFamily: font(),
        fontSize: 14,
        lineHeight: 18,
      } as TextStyle,
    },
    price: {
      container: {
        marginVertical: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      } as ViewStyle,
      button: {
        borderWidth: 1,
        borderRadius: 24,
      } as ViewStyle,
      price: {
        textAlign: 'center',
        fontFamily: font(600),
        fontSize: 14,
        lineHeight: 16,
        minWidth: 75,
      } as TextStyle,
    },
  },
  element: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 8,
  } as ViewStyle,
  marginTop: {
    marginTop: ScreenStyles.paddingTop,
  } as ViewStyle,
  marginHorizontal: {
    marginHorizontal: 16,
  } as ViewStyle,
  label: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 24,
  } as TextStyle,
  footer: {
    marginTop: 30,
  } as ViewStyle,
}

export default React.memo(RenderItem)
