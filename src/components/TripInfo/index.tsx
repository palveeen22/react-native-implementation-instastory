import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { CitySuggestType, Nullable, TripInfoType, TripRoleType } from '../../types'
import { t } from '../../localization'
import { isSmallScreen } from '../../theme'
import moment from 'moment'
import 'moment/locale/ru'
import { Alert, Button } from '../'
import TripBody from './TripBody'
import TripFooter from './TripFooter'
import TripHeader from './TripHeader'
import PassengersInfo from './PassengersInfo'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import { getMyRides, allBookedCount } from '../../services'
import CustomModal from '../ModalCustomize'
moment().locale('ru')

export type tripInfoTypeView = 'tripsPublished' | 'tripsBooking' | 'tripDetail' | 'tripSearch'
export { TripFooter, PassengersInfo }

interface TripInfoProps {
  style?: ViewStyle | ViewStyle[]
  type: tripInfoTypeView
  trip: Nullable<TripInfoType>
  onPress?: (trip: TripInfoType) => void
  viewForDriverComp?: boolean
  onCancelConfirm?: (trip_id: number) => void
  role?: TripRoleType
  currency?: string
  showDetailInfo?: boolean
  onDetailInfoStateChange?: () => void
  searchDeparture?: CitySuggestType
  searchDestination?: CitySuggestType
}

export default function TripInfo(props: TripInfoProps) {
  const {
    style,
    trip,
    type,
    onPress,
    viewForDriverComp,
    onCancelConfirm,
    role = 'applicant',
    currency,
    showDetailInfo = false,
    onDetailInfoStateChange,
    searchDeparture,
    searchDestination,
  } = props
  if (!trip) {
    return null
  }
  //HERE ZADACA
  const { dark, colors } = useTheme()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const { status, max_passengers, driver, passengers, rides } = trip

  const profile = useSelector((state: AppState) => state.user.profile)

  const myRides = getMyRides(rides, profile, role, searchDeparture?.id, searchDestination?.id)

  const price = myRides.reduce((value, ride) => value + +ride.price, 0)
  const departure = myRides[0]?.start
  const destination = myRides[myRides.length - 1]?.end

  const tripTime = moment(myRides[0]?.start?.datetime)
    ?.utcOffset(myRides[0]?.start?.tz_offset || 180)
    ?.format('dd, DD MMMM, H:mm')

  const passengersConfimBooked = passengers?.length || 0

  const passengersRides = myRides.map((ride) => ride.passengers)

  const passengersCount = allBookedCount(passengersRides)

  let activityIndicatorTextColor = null
  let visibleCancelButton = null

  switch (status) {
    case 'completed':
    case 'finished':
    case 'cancelled': {
      activityIndicatorTextColor = colors.tripInfo.header.cancelledLabel
      visibleCancelButton = false
      break
    }
    case 'in_progress':
    case 'onCreate':
    case 'active': {
      activityIndicatorTextColor = colors.tripInfo.header.label
      visibleCancelButton = true
      break
    }
  }

  function buttonsRender() {
    if (type === 'tripDetail' || type === 'tripSearch') {
      return null
    } else {
      return (
        <View style={styles.buttonBlock}>
          {visibleCancelButton && (
            <Button
              text={t('cancel')}
              type={'secondary'}
              style={[styles.button, { marginRight: 8 }]}
              onPress={() => setModalVisible(true)}
            />
          )}
          <Button text={t('look')} style={styles.button} onPress={() => !!onPress && onPress(trip)} />
        </View>
      )
    }
  }

  const _rides = showDetailInfo
    ? rides
    : rides.length
      ? [
        {
          start: departure,
          end: destination,
          price: rides.reduce((prev, current) => prev + current.price, 0),
          passengers: [],
        },
      ]
      : null

  return (
    <TouchableOpacity
      activeOpacity={type === 'tripSearch' ? undefined : 1}
      style={style}
      onPress={() => type == 'tripSearch' && !!onPress && onPress(trip)}
    >
      <View style={[styles.container, { backgroundColor: colors.background.lightgrey }]}>
        {type !== 'tripSearch' && <TripHeader style={styles.header} type={type} tripTime={tripTime} status={status} />}
        <TripBody
          style={styles.boody}
          distArr={_rides}
          type={type}
          status={status}
          departure={departure}
          destination={destination}
          role={role}
          showDetailInfo={showDetailInfo}
        />
        <TripFooter
          style={[styles.footer, { borderColor: colors.separator.default }]}
          passengersConfimBooked={passengersConfimBooked}
          allPassengersCount={passengersCount}
          activityIndicatorTextColor={activityIndicatorTextColor}
          max_passengers={max_passengers}
          profile={driver}
          status={status}
          type={type}
          currency={currency}
          price={price}
          isDriver={role === 'driver'}
          showDetailInfo={showDetailInfo}
          onDetailInfoStateChange={onDetailInfoStateChange}
        />
      </View>

      {buttonsRender()}
      <CustomModal
        visible={modalVisible}
        onClickFirst={() => {
          setModalVisible(false)
          return !!onCancelConfirm && onCancelConfirm(trip.id)
        }}
        onClickSecond={() => {
          setModalVisible(false)
        }}
        title={t(role === 'driver' ? 'confirm_cancel_trip' : 'confirm_cancel_booking')}
        textFirst={t('yes_cancel')}
        textSecond={t('dont_cancel')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    paddingTop: 24,
  },
  buttonBlock: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    height: 50,
    flex: 1,
    borderRadius: 10,
  },
  header: {
    marginBottom: isSmallScreen() ? 16 : 19,
  },
  boody: {},
  boodyMargin: {
    marginTop: 24,
  },
  footer: {
    borderTopWidth: 1,
  },
})
