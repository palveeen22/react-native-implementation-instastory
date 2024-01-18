import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { tripInfoTypeView } from '.'
import { t } from '../../localization'
import { font } from '../../theme'
import { TripStatusType } from '../../types'

export interface PassengersInfoProps {
  style?: ViewStyle | ViewStyle[]
  seats: number
  price: number
  currency: string
  booked: number
  all_booked: number
  status: TripStatusType
  type?: tripInfoTypeView
}

export default function (props: PassengersInfoProps) {
  const { colors } = useTheme()
  const { style, seats = 0, price = 0, currency, booked = 0, all_booked = 0, status, type } = props

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tripsPublishedContainer}>
        <View style={[styles.tripsPublishedTextRow]}>
          <Text style={[styles.secondaryFont, { color: colors.tripInfo.footer.textSecondary }]}>
            {t('total_seats')}
          </Text>
          <Text
            style={[
              styles.secondaryFont,
              {
                color:
                  status === 'onCreate' ? colors.tripInfo.footer.textPrimary : colors.tripInfo.footer.textSecondary,
              },
            ]}
          >
            {t('seats', null, { count: seats })}
          </Text>
        </View>

        <View style={styles.tripsPublishedTextRow}>
          <Text style={[styles.secondaryFont, { color: colors.tripInfo.footer.textSecondary }]}>
            {t('cost_of_travel')}
          </Text>
          <Text
            style={[
              styles.secondaryFont,
              {
                color:
                  status === 'onCreate' ? colors.tripInfo.footer.textPrimary : colors.tripInfo.footer.textSecondary,
              },
            ]}
          >
            {t('currency', [price, currency])}
          </Text>
        </View>

        {status !== 'onCreate' && (
          <View style={styles.tripsPublishedTextRow}>
            <Text
              style={[
                styles.secondaryFont,
                {
                  color:
                    type !== 'tripsPublished'
                      ? colors.tripInfo.footer.textSecondary
                      : colors.tripInfo.footer.textPrimary,
                },
              ]}
            >
              {t('bookeds')}
            </Text>
            <Text
              style={[
                status !== 'cancelled' ? styles.primaryFont : styles.secondaryFont,
                {
                  color:
                    status !== 'cancelled' ? colors.tripInfo.footer.textPrimary : colors.tripInfo.footer.textSecondary,
                },
              ]}
            >
              {t('seats', null, { count: all_booked })}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  tripsPublishedContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  tripsPublishedTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  primaryFont: {
    fontFamily: font(600),
    fontSize: 14,
    lineHeight: 18,
  },
  secondaryFont: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
})
