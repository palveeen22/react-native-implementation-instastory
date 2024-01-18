import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { tripInfoTypeView } from './index'
import { t } from '../../localization'
import { font } from '../../theme'
import { TripStatusType } from '../../types'

interface TripHeaderProps {
  type: tripInfoTypeView
  tripTime: string
  status: TripStatusType
  style?: ViewStyle | ViewStyle[]
}

export default function ({ type, tripTime, status, style }: TripHeaderProps) {
  const { dark, colors } = useTheme()

  const tripStatus = (status: string) => {
    switch (status) {
      case 'new':
        return ''
      case 'finished':
        return t('finished')
      case 'in_progress':
        return t('on_the_way')
      case 'cancelled':
        return t('cancelled')
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.tripTimeTextFont, { color: colors.text.title }]}>{tripTime}</Text>
      <Text
        style={[
          type === 'tripDetail' ? styles.tripDetailFont : styles.statusFont,
          { color: colors.tripInfo.header.status },
        ]}
      >
        {tripStatus(status)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  tripTimeTextFont: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  },
  statusFont: {
    fontFamily: font(600),
  },
  tripDetailFont: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  },
})
