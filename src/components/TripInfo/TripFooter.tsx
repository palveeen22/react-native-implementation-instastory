import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle, Pressable } from 'react-native'
import { t } from '../../localization'
import { font } from '../../theme'
import { TripStatusType, UserProfile } from '../../types'
import { tripInfoTypeView } from './index'
import { Icon } from '../'
import PassengersInfo from './PassengersInfo'
import Avatar from '../Avatar'

interface TripFooterProps {
  type: tripInfoTypeView
  status: TripStatusType
  passengersConfimBooked: number
  allPassengersCount?: number
  max_passengers?: number
  activityIndicatorTextColor?: string
  style?: ViewStyle | ViewStyle[]
  price?: number
  currency?: string
  isDriver?: boolean
  showDetailInfo?: boolean
  onDetailInfoStateChange?: () => void
  profile?: UserProfile
}

export default function (props: TripFooterProps) {
  const { dark, colors } = useTheme()
  const {
    max_passengers,
    activityIndicatorTextColor,
    style,
    type,
    price,
    currency,
    status,
    passengersConfimBooked,
    allPassengersCount,
    isDriver,
    showDetailInfo,
    onDetailInfoStateChange,
    profile,
  } = props
  const defaultTextColor = colors.text.default

  function priceRender() {
    let priceColor = null
    let currencyBackground = null
    let currencyColor = null

    if (status === 'cancelled') {
      priceColor = colors.tripInfo.footer.cancelled
      currencyBackground = colors.tripInfo.footer.currencyCancelledBackground
      currencyColor = colors.tripInfo.footer.currencyCanceled
    } else if (type === 'tripDetail') {
      priceColor = defaultTextColor
      currencyBackground = colors.tripInfo.footer.currencyBackground
      currencyColor = colors.tripInfo.footer.currency
    } else if (status != 'active') {
      priceColor = activityIndicatorTextColor
      currencyBackground = colors.tripInfo.footer.currencyBackground
      currencyColor = colors.tripInfo.footer.currency
    } else {
      priceColor = defaultTextColor
      currencyBackground = colors.tripInfo.footer.currencyBackground
      currencyColor = colors.tripInfo.footer.currency
    }
    //HERE
    return (
      <View style={[styles.priceContainer]}>
        <Text style={[styles.price, { color: priceColor }]}>{t('currency', [price, ''])}</Text>
        <View style={[styles.bgCurrency, { backgroundColor: currencyBackground }]}>
          <Text style={[styles.currencyFont, { color: currencyColor }]}>{currency}</Text>
        </View>
      </View>
    )
  }

  function tripsPublished() {
    const _style: ViewStyle = Array.isArray(style)
      ? style.reduce((styles, style) => ({ ...styles, ...style }), {})
      : style

    return (
      <PassengersInfo
        style={_style}
        seats={max_passengers}
        price={price}
        currency={currency}
        booked={passengersConfimBooked}
        all_booked={allPassengersCount}
        status={status}
        type={type}
      />
    )
  }

  function tripsBooking() {
    return (
      <View style={[styles.container, { borderTopColor: colors.background.line }, style]}>
        <View style={styles.imageProfileAndName}>
          <Avatar
            profile={profile}
            backgroundColor={
              status === 'cancelled'
                ? colors.tripInfo.footer.avatarCancelledBackground
                : colors.tripInfo.footer.avatarCancelledBackground
            }
            tintColor={status === 'cancelled' ? colors.tripInfo.footer.avatarCancelled : colors.tripInfo.footer.avatar}
          />
          <Text
            style={[
              styles.name,
              {
                color: status === 'cancelled' ? colors.tripInfo.footer.cancelled : colors.tripInfo.footer.active,
              },
            ]}
          >
            {profile?.first_name}
          </Text>
        </View>

        {priceRender()}
      </View>
    )
  }

  function tripDetail() {
    if (isDriver) {
      return (
        <View style={[styles.container, styles.driverContainer, { borderColor: colors.background.line }, style]}>
          <Pressable style={styles.driverContent} onPress={onDetailInfoStateChange}>
            <Text style={[styles.driverText, { color: colors.tripInfo.footer.main }]}>
              {t(showDetailInfo ? 'hide_intermediate_cities' : 'show_intermediate_cities')}
            </Text>
            <Icon name={showDetailInfo ? 'chevronUp' : 'chevronDown'} color={colors.tripInfo.footer.main} size={20} />
          </Pressable>
        </View>
      )
    }
    return (
      <View style={[styles.container, { borderTopColor: colors.background.line }, style]}>
        <Text style={[styles.seatPrice, { color: colors.tripInfo.footer.textPrimary }]}>{t('price_per_seat')}</Text>
        {priceRender()}
      </View>
    )
  }

  // render
  switch (type) {
    case 'tripsPublished': {
      return tripsPublished()
    }
    case 'tripSearch':
    case 'tripsBooking': {
      return tripsBooking()
    }
    case 'tripDetail': {
      return tripDetail()
    }
  }
}

const styles = StyleSheet.create({
  driverContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  driverContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverText: {
    marginRight: 8,
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 18,
    borderTopWidth: 1,
    paddingHorizontal: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: font(600),
    fontSize: 14,
    lineHeight: 16,
    marginRight: 6,
  },
  bgCurrency: {
    borderRadius: 20,
    minHeight: 16,
    minWidth: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  currencyFont: {
    fontFamily: font('bold'),
    fontSize: 10,
    lineHeight: 16,
    position: 'absolute',
    paddingBottom: 1,
  },
  imageProfileAndName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  name: {
    marginLeft: 16,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
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
    lineHeight: 16,
  },
  seatPrice: {
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
  },
})
