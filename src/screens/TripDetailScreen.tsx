/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, ViewStyle, TextStyle, ScrollView, Alert as AlertDefault } from 'react-native'
import {
  Alert,
  BookingSuccessImage,
  Button,
  ListItem,
  Screen,
  Selector,
  TripComfortItem,
  TripInfo,
  PassengersInfo,
  InfoModal,
  ScreenStyles,
  Modal,
  Counter,
  Icon,
} from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { CarType, Nullable, TripRoleType, UserProfile } from '../types'
import { Linking } from 'react-native'
import {
  tripBookingRequestAction,
  tripCancelBookingRequestAction,
  tripCancelRequestAction,
  tripDetailRequestAction,
  tripFinishRequestAction,
} from '../store/redux/trip'
import AppMetrica from 'react-native-appmetrica'

import moment from 'moment'
import 'moment/locale/ru'
import { getMyRides, getScrollOffset, allBookedCount } from '../services'
import CustomModal from '../components/ModalCustomize'
moment().locale('ru')

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  showBookingModal: boolean
  searching: boolean
  showSuccessBookingModal: boolean
  role: Nullable<TripRoleType>
  showDetailInfo: boolean
  scrollOffset: number
  contentHeight: number
  seats_amount: number
  modalVisible: boolean
}

const TripDetailScreen: React.FC<Props> = ({
  route,
  navigation,
  getTrip,
  tripDetail: getTripDetail,
  profile,
  trip_cancel_fetching,
  trip_finish_fetching,
  search_request,
  currency,
  fetching,
  cancel_booking_fetching,
  cancel_booking_error,
  booking_fetching,
  booking_error,
  trip_info_update,
  bookTrip,
  cancelBooking,
  cancelTrip,
  finishTrip,
}) => {
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false)
  const [canBooking, setCanBooking] = useState<boolean>(false)
  const [searching, setSearching] = useState<boolean>(false)
  const [showSuccessBookingModal, setShowSuccessBookingModal] = useState<boolean>(false)
  const [role, setRole] = useState<Nullable<TripRoleType>>(null)
  const [showDetailInfo, setShowDetailInfo] = useState<boolean>(true)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [seats_amount, setSeatsAmount] = useState<number>(1)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalEditVisible, setModalEditVisible] = useState<boolean>(false)
  const [tripDetail, setTripDetail] = useState<any>()

  const { screenName, id, updated_data } = route.params

  useEffect(() => {
    screenName('TripDetailScreen')

    if (updated_data?.id) {
      setTripDetail(trip_info_update !== null ? trip_info_update : updated_data)
    } else {
      setTripDetail(getTripDetail)
    }

    getTrip({ id })

    return () => {
      screenName('MyTripsScreen')
    }
  }, [getTripDetail, trip_info_update])

  useEffect(() => {
    if (!!profile && !!tripDetail && !fetching) {
      const isDriver = profile.id === tripDetail.driver?.id

      let isPassenger = false
      tripDetail?.passengers.forEach((pax: any) => {
        if (pax?.id === profile.id) {
          isPassenger = true
        }
      })

      const roleTemp = isDriver ? 'driver' : isPassenger ? 'passenger' : 'applicant'
      const bookingTemp = tripDetail.status !== 'cancelled' && roleTemp === 'applicant'

      setRole(roleTemp)
      setCanBooking(bookingTemp)
    }

    //WHAT IS THIS FOR?
    // if (!cancel_booking_fetching && !cancel_booking_error) {
    //   setRole('applicant')
    // }

    //WHAT IS THIS FOR?
    // if (!booking_fetching && !booking_error) {
    //   setRole('passenger')
    //   //COMENTING FOR A WHILE DUE TO ERROR
    //   // setShowSuccessBookingModal(true)
    // }
  })

  if (!tripDetail) {
    return null
  }

  const colors: ThemeColors = route.params.colors
  const is_verified_user: boolean = false
  const totalCost = tripDetail?.rides?.reduce((value, item) => value + item.price, 0)

  const passengersRides = tripDetail?.rides.map((ride) => ride.passengers)

  const passengersCount = allBookedCount(passengersRides)
  const isInProgress = tripDetail?.status === 'in_progress'
  const hasFreeSeats = passengersCount < tripDetail?.max_passengers


  const renderPassenger = (
    passenger: UserProfile,
    index: number,
    onSendMessagePress?: (phone: string) => void,
    onCallPress?: (phone: string) => void,
    onCancelPassengerPress?: (user_id: number) => void
  ) => {
    const rides = tripDetail.rides.filter((ride) =>
      ride.passengers.map((passenger) => passenger.id).includes(passenger.id)
    )
    const count = rides.map((ride) => ride.passengers)[0].find((pass) => pass.id == passenger.id).count_passengers
    const departure = rides[0].start.main_text
    const destination = rides[rides.length - 1].end.main_text
    return (
      <ListItem
        key={index.toString()}
        style={index > 0 ? styles.passengerItem : undefined}
        profile={passenger}
        onPress={() => onProfilePress(passenger)}
        text={`${departure}-${destination}`}
        onSendMessagePress={onSendMessagePress}
        onCallPress={onCallPress}
        onCancelPassengerPress={onCancelPassengerPress}
        count={count}
      />
    )
  }

  const onProfilePress = (profile: UserProfile, car?: CarType) => {
    //WHAT IS THE CONDITIONING FOR?
    // if (currentUser.id === profile.id) {
    // if (profile.id) {
    // navigation.navigate('ProfileStack', { screen: 'ProfileScreen' })
    // } else {
    navigation.navigate('PublicProfileViewScreen', { profile, car })
    // }
  }

  const onBookNow = () => {
    if (searching) {
      setSearching(false)
      setShowBookingModal(false)

      const bookTripDetail: any = {
        ride_id: tripDetail.id,
        passengers: seats_amount,
        start_city_id: search_request.departure.id,
        start_city: search_request.departure.main_text,
        end_city_id: search_request.destination.id,
        end_city: search_request.destination.main_text,
      }
      AppMetrica.reportEvent('bookTrip', { bookTripDetail })
      setShowSuccessBookingModal(true)
      bookTrip(bookTripDetail)
    }
  }

  const onSetModalTrue = () => {
    setModalVisible(true)
  }

  const onPressDetailTrip = () => {
    navigation.navigate('Main', {
      screen: 'NewTripStack',
      params: {
        screen: 'NewTripDetailScreen',
        params: { isEdit: true, id: route?.params?.id, tripDetail },
      },
    })
  }

  const onPressDateTimeTrip = () => {
    setModalEditVisible(false)
    navigation.navigate('TimeDateScreen', {
      params: { isEdit: true, id: route?.params?.id, tripDetail },
    })
  }
  const onPressRouteScreen = () => {
    setModalEditVisible(false)
    navigation.navigate('EditRouteScreen', {
      params: { isEdit: true, id: route?.params?.id, tripDetail },
    })
  }

  const onPressPriceTrip = () => {
    navigation.navigate('Main', {
      screen: 'NewTripStack',
      params: {
        screen: 'NewTripIntermediatePriceScreen',
        params: { isEdit: true, id: route?.params?.id, tripDetail },
      },
    })
  }

  const onPressMessage = (num: string) => {
    Linking.openURL(`sms:${num}`)
  }

  const onPressCall = (num: string) => {
    Linking.openURL(`tel:${num}`)
  }

  const onPressGoMain = () => {
    navigation.replace('Main')
  }

  const onCancelPassengerPressFunction = (passenger_id: number) => {
    Alert.alert(`onCancelPassengerPress\npassenger_id:${passenger_id}`)
  }

  const createThreeButtonAlert = () =>
    AlertDefault.alert(
      'Вы не можете редактировать поездку',
      'К вам уже присоединились пассажиры. Если поездка неактуальна, нужно её отменить и создать новую.',
    )

  const onDetailInfoStateChange = () => {
    setShowDetailInfo(!showDetailInfo)
  }

  const changeSeatsAmount = (seats: number) => {
    const myRides = getMyRides(
      tripDetail.rides,
      profile,
      role,
      search_request?.departure?.id,
      search_request?.destination?.id
    )
    const confirmedPassengers = myRides
      .flatMap((ride) => ride.passengers)
      .filter((passenger) => passenger.confirmed)
      .filter((passenger, index, self) => self.map((passenger) => passenger.id).indexOf(passenger.id) === index)
      .reduce((acc, el) => acc + el.count_passengers, 0)
    const freeSeats = tripDetail.max_passengers - confirmedPassengers
    const new_amount = seats_amount + seats
    if (new_amount <= freeSeats && new_amount >= 1) {
      setSeatsAmount(seats_amount + seats)
    }
  }
  const isFetching = booking_fetching || trip_finish_fetching || trip_cancel_fetching || cancel_booking_fetching || fetching

  return (
    <Screen
      title={t('aboutTrip')}
      enableScroll={false}
      scrollOffset={scrollOffset}
      fetching={isFetching}
      contentHeight={contentHeight}
    >
      {!isFetching ? (
        <>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.contentContainer, { paddingBottom: canBooking ? 40 : 8 }]}
            onScroll={(e) => setScrollOffset(getScrollOffset(e))}
            scrollEventThrottle={1}
            onContentSizeChange={(w, contentHeight) => setContentHeight(contentHeight)}
          >
            <TripInfo
              type={'tripDetail'}
              style={{ marginTop: 24 }}
              // trip={tripDetail}
              trip={tripDetail}
              role={role}
              currency={currency}
              showDetailInfo={showDetailInfo}
              onDetailInfoStateChange={onDetailInfoStateChange}
              searchDeparture={search_request?.departure}
              searchDestination={search_request?.destination}
            />

            {role === 'driver' && (
              <PassengersInfo
                style={[styles.tripInfo.container, { backgroundColor: colors.background.lightgrey }]}
                seats={tripDetail?.max_passengers}
                price={+totalCost}
                currency={currency}
                all_booked={passengersCount}
                booked={tripDetail?.passengers?.length}
                status={tripDetail.status}
              />
            )}

            {(role === 'applicant' || role === 'passenger') && (
              <View style={styles.labelMargin}>
                <Text style={[styles.label, { color: colors.text.default }]}>{t('driver')}</Text>
                <ListItem profile={tripDetail?.driver} onPress={() => onProfilePress(tripDetail.driver, tripDetail.car)} />
                {!!tripDetail?.comment && (
                  <Text
                    style={[
                      styles.comment,
                      styles.commentMargin,
                      {
                        color: colors.text.default,
                        backgroundColor: colors.background.lightgrey,
                      },
                    ]}
                  >
                    {tripDetail.comment}
                  </Text>
                )}
                <View style={styles.actionButtons.container}>
                  {role === 'passenger' && (
                    <Selector
                      style={styles.actionButtons.callButton}
                      text={t('call')}
                      onPress={() => onPressCall(tripDetail.driver.phone)}
                      textStyle={{ color: colors.text.default }}
                    />
                  )}
                  <Selector
                    style={styles.actionButtons.writeButton}
                    text={t('write')}
                    selected
                    onPress={() => onPressMessage(tripDetail.driver.phone)}
                  />
                </View>
              </View>
            )}

            {role === 'driver' && (
              <View>
                <Text
                  style={[
                    styles.label,
                    styles.labelMargin,
                    tripDetail?.passengers?.length ? undefined : styles.labelSmallMargin,
                    { color: colors.text.default },
                  ]}
                >
                  {t('passengers')}
                </Text>
                {tripDetail?.passengers?.length ? (
                  <View>
                    {tripDetail.passengers.map((passenger, index) =>
                      renderPassenger(
                        passenger,
                        index,
                        onPressMessage,
                        onPressCall
                        // onCancelPassengerPressFunction,
                      )
                    )}
                  </View>
                ) : (
                  <Text style={[styles.description, { color: colors.text.secondary }]}>{t('trip_wo_passengers')}</Text>
                )}
                {tripDetail?.comment && (
                  <>
                    <Text style={[styles.label, styles.labelMargin, { color: colors.text.default }]}>
                      {t('trip_comment_short')}
                    </Text>
                    <Text
                      style={[
                        styles.comment,
                        {
                          color: colors.text.default,
                          backgroundColor: colors.background.lightgrey,
                        },
                      ]}
                    >
                      {tripDetail.comment}
                    </Text>
                  </>
                )}
              </View>
            )}

            <Text style={[styles.label, styles.labelMargin, { color: colors.text.default }]}>{t('car')}</Text>
            <ListItem car={tripDetail?.car} />

            <Text style={[styles.label, styles.labelMargin, { color: colors.text.default }]}>{t('comfort')}</Text>
            <TripComfortItem type={'babyChair'} value={tripDetail?.baby_chair} style={styles.comfortMargin} />
            <TripComfortItem type={'max2seat'} value={tripDetail?.max2seat} style={styles.comfortMargin} />
            <TripComfortItem type={'delivery'} value={tripDetail?.take_delivery} style={styles.comfortMargin} />
            <TripComfortItem type={'cargo'} value={tripDetail?.cargo} style={styles.comfortMargin} />
            <TripComfortItem type={'animals'} value={tripDetail?.animals} style={styles.comfortMargin} />
            <TripComfortItem type={'smoke'} value={tripDetail?.can_smoke} />

            {(role === 'applicant' || role === 'passenger') && (
              <View>
                <Text style={[styles.label, styles.labelMargin, styles.labelSmallMargin, { color: colors.text.default }]}>
                  {t('passengers')}
                </Text>
                <Text style={[styles.label, styles.description, { color: colors.text.secondary }]}>
                  {t('passengers_description')}
                </Text>
                {tripDetail?.passengers?.map((passenger, index) => renderPassenger(passenger, index))}
              </View>
            )}

            {(tripDetail.status !== 'cancelled' && tripDetail.status !== 'finished') && (role === 'passenger' || role === 'driver') && (
              <View>
                <Text style={[styles.label, styles.labelMargin, { color: colors.text.default }]}>{t('trip_actions')}</Text>
                {role === 'passenger' && (
                  <View>
                    <ListItem style={styles.actions.button} text={t('cancel_booking')} onPress={onSetModalTrue} />
                  </View>
                )}
                {role === 'driver' && (
                  <View
                    style={{
                      rowGap: 10,
                    }}
                  >
                    <ListItem
                      style={styles.actions.button}
                      text={t('edit_trip')}
                      onPress={() => {
                        if (tripDetail?.passengers?.length) {
                          createThreeButtonAlert()
                        } else {
                          setModalEditVisible(!modalEditVisible)
                        }
                      }}
                    />
                    <ListItem style={styles.actions.button} text={isInProgress ? t('finish_trip') : t('cancel_trip')} onPress={onSetModalTrue} />
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* {canBooking && is_verified_user && (
            <Button type={'secondary'} textStyle={hasFreeSeats ? {} : { fontFamily: font('bold') }} style={styles.bookingButton} text={hasFreeSeats ? t('book_now') : t('no_more_place')} onPress={() => hasFreeSeats ? setShowBookingModal(true) : null} />
          )} */}
          {canBooking && !is_verified_user && (
            <View>
              <View style={[styles.warning, { marginVertical: 10, paddingHorizontal: 20 }]}>
                <Icon
                  name={'info'}
                  // style={styles.icon}
                  // size={iconSize}
                  color={'#4D2186'}
                />
                <View style={styles.warning}>
                  <Text style={{ color: '#2F2A2A' }}>Подтвердите личность, чтобы забронировать поездку</Text>
                </View>
              </View>
              <Button type={'primary'} textStyle={hasFreeSeats ? {} : { fontFamily: font('bold') }} style={styles.bookingButton} text={t('verified_document')} onPress={() => {
                navigation.navigate('ProfileStack', { screen: 'DocumentsScreen' })
              }} />
            </View>
          )}

        </>
      ) : (<></>)
      }

      <Modal
        isVisible={modalEditVisible}
        onClose={() => {
          setModalEditVisible(!modalEditVisible)
        }}
        header={'Редактировать поездку'}
        fullScreen
        closeButton={true}
      >
        <View
          style={{
            rowGap: 5,
            paddingHorizontal: 10,
          }}
        >
          <ListItem style={styles.actions.buttonModal} text={t('change_route')} onPress={onPressRouteScreen} />
          <ListItem style={styles.actions.buttonModal} text={t('change_time')} onPress={onPressDateTimeTrip} />
          <ListItem
            style={styles.actions.buttonModal}
            text={t('trip_detail_screen_name')}
            onPress={onPressDetailTrip}
          />
          <ListItem style={styles.actions.buttonModal} text={t('price')} onPress={onPressPriceTrip} />
        </View>
      </Modal>

      <InfoModal
        image={<BookingSuccessImage />}
        isVisible={showSuccessBookingModal}
        title={t('successfully_booked')}
        text={t('have_a_nice_trip')}
        buttons={[{ text: t('main_page'), onPress: onPressGoMain }]}
      />

      <Modal
        isVisible={showBookingModal && !searching}
        fullScreen
        header={t('booking_trip')}
        onClose={() => setShowBookingModal(false)}
        onModalHide={onBookNow}
      >
        <View style={{ padding: 16 }}>
          <Text style={[styles.label, { color: colors.text.default }]}>{t('booking_seats')}</Text>
          <Counter value={seats_amount} onChange={changeSeatsAmount} />
          <Button style={styles.bookingModal.booking} text={t('confirm')} onPress={() => setSearching(true)} />
        </View>
      </Modal>

      <CustomModal
        visible={modalVisible}
        onClickFirst={() => {
          if (role === 'passenger') {
            cancelBooking({ ride_id: tripDetail.id })
          } else {
            if (isInProgress) {
              finishTrip({ ride_id: tripDetail.id })
            } else {
              cancelTrip({ ride_id: tripDetail.id })
            }
          }
          navigation.navigate('MyTripsScreen')
        }}
        onClickSecond={() => {
          setModalVisible(false)
        }}
        title={role === 'passenger' ? t('confirm_cancel_booking') : isInProgress ? t('confirm_finish_trip') : t('confirm_cancel_trip')}
        textFirst={isInProgress ? t('yes_finish') : t('yes_cancel')}
        textSecond={isInProgress ? t('dont_finish') : t('dont_cancel')}
      />
    </Screen>
  )
  // changeSeatsAmount = (seats: number) => {  // Славина функция
  //   const { seats_amount, role } = this.state
  //   const { tripDetail, profile, search_request } = this.props
  //   const myRides = getMyRides(
  //     tripDetail.rides,
  //     profile,
  //     role,
  //     search_request?.departure?.id,
  //     search_request?.destination?.id,
  //   )
  //   const confirmedPassengers = myRides
  //     .flatMap((ride) => ride.passengers)
  //     .filter((passenger) => passenger.confirmed)
  //     .filter((passenger, index, self) => self.map((passenger) => passenger.id).indexOf(passenger.id) === index)
  //   const freeSeats = tripDetail.max_passengers - confirmedPassengers.length
  //   const new_amount = seats_amount + seats
  //   if (new_amount > confirmedPassengers.length && new_amount <= freeSeats) {
  //     this.setState({ seats_amount: seats_amount + seats })
  //   }
  // }
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  tripDetail: state.trip.trip_info,
  fetching: state.trip.trip_info_fetching,
  profile: state.user.profile,
  cancel_booking_fetching: state.trip.cancel_booking_fetching,
  cancel_booking_error: state.trip.cancel_booking_error,
  booking_fetching: state.trip.trip_booking_fetching,
  booking_error: state.trip.trip_booking_error,
  trip_cancel_fetching: state.trip.trip_cancel_fetching,
  trip_finish_fetching: state.trip.trip_finish_fetching,
  currency: state.countries.country?.currency_code,
  search_request: state.trip.search_request,
  trip_info_update: state.trip.trip_info_update,
})

const mapDispatchToProps = {
  getTrip: tripDetailRequestAction,
  cancelBooking: tripCancelBookingRequestAction,
  bookTrip: tripBookingRequestAction,
  cancelTrip: tripCancelRequestAction,
  finishTrip: tripFinishRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(TripDetailScreen)

const styles = {
  contentContainer: {
    ...ScreenStyles,
    flexGrow: 1,
    paddingHorizontal: 16,
  } as ViewStyle,
  tripInfo: {
    container: {
      marginTop: 8,
      paddingBottom: 16,
      paddingTop: 6,
      paddingHorizontal: 24,
    } as ViewStyle,
    row: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    } as ViewStyle,
    label: {
      fontFamily: font(),
      fontSize: 12,
      lineHeight: 16,
    } as TextStyle,
    booked: {
      fontFamily: font(600),
      fontSize: 14,
    } as TextStyle,
  },
  bookingButton: {
    marginVertical: 8,
    minHeight: 50,
    marginHorizontal: 16,
  } as ViewStyle,
  label: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  } as TextStyle,
  labelMargin: {
    marginTop: 32,
  } as ViewStyle,
  labelSmallMargin: {
    marginBottom: 8,
  } as ViewStyle,
  comment: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    borderRadius: 2,
    overflow: 'hidden',
  } as TextStyle,
  commentMargin: {
    marginTop: 10,
  } as ViewStyle,
  actionButtons: {
    container: {
      marginTop: 16,
      flexDirection: 'row',
    } as ViewStyle,
    callButton: {
      flex: 1,
      marginRight: 9,
    } as ViewStyle,
    writeButton: {
      flex: 1,
    } as ViewStyle,
  },
  warning: { flexDirection: 'row', gap: 5 } as ViewStyle,
  comfort: {} as ViewStyle,
  comfortMargin: {
    marginBottom: 8,
  } as ViewStyle,
  description: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
  passengerItem: {
    marginTop: 10,
  } as ViewStyle,
  actions: {
    button: {
      borderWidth: 1,
      minHeight: 56,
    } as ViewStyle,
    buttonModal: {
      borderBottomWidth: 1,
      minHeight: 56,
    } as ViewStyle,
    margin: {
      marginBottom: 10,
    } as ViewStyle,
  },
  bookingModal: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    selector: {
      flex: 1,
    } as ViewStyle,
    text: {
      minWidth: 80,
      fontFamily: font(600),
      fontSize: 16,
      lineHeight: 20,
      textAlign: 'center',
    } as TextStyle,
    booking: {
      marginTop: 32,
    } as ViewStyle,
  },
}
