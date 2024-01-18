import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Counter, ListItem, Modal, Screen, Selector, Switch, TextInput } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { CarType, NewTripDetails, Nullable, PassengerPaymentType } from '../types'
import { carsRequestAction } from '../store/redux/cars'
import { detailUpdateAction, newTripSetDetailsAction } from '../store/redux/newTrip'
import { showMessage } from 'react-native-flash-message'
import config from '../config'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type NewTripDetailScreenProps = ScreenProps & StateProps & {}

interface State extends NewTripDetails {
  showCarSelectModal: boolean
  carError: Nullable<boolean>
  passengerPaymentError: Nullable<boolean>
}

type detailsType = {
  passengerPayment: Nullable<string>
  confirmBooking: false
  passengerPaymentError: Nullable<PassengerPaymentType>
}

const NewTripDetailScreen: React.FC<NewTripDetailScreenProps> = ({
  getCars,
  cars,
  car_fetching,
  route,
  navigation,
  setDetails,
  editDetail,
}) => {
  const { isEdit, id, tripDetail } = route.params

  const [passengers, setPassengers] = useState<number>(0)
  const [car, setCar] = useState<Nullable<CarType>>(null)
  const [carError, setCarError] = useState<Nullable<boolean>>(null)
  const [showCarSelectModal, setShowCarSelectModal] = useState<boolean>(false)
  const [animals, setAnimals] = useState<boolean>(false)
  const [babyChair, setBabyChair] = useState<boolean>(false)
  const [canSmoke, setCanSmoke] = useState<boolean>(false)
  const [takeDelivery, setTakeDelivery] = useState<boolean>(false)
  const [cargo, setCargo] = useState<boolean>(false)
  const [max2Seats, setMax2Seats] = useState<boolean>(false)
  const [comment, setComment] = useState<string | null>(null)
  const [passengerPaymentError, setPassengerPaymentError] = useState<Nullable<boolean>>(null)
  const [passengerPayment, setPassengerPayment] = useState<Nullable<PassengerPaymentType>>(null)
  const [confirmBooking, setConfirmBooking] = useState<boolean>(false)

  useEffect(() => {
    getCars()
    setPassengerPayment('card')
    if (tripDetail) {
      const {
        animals: animalsTripDetail,
        max2seat,
        max_passengers,
        baby_chair,
        can_smoke,
        take_delivery,
        comment: commentTripDetail,
        cargo: cargoTripDetail,
      } = tripDetail
      setPassengers(max_passengers)
      setAnimals(animalsTripDetail)
      setBabyChair(baby_chair)
      setCanSmoke(can_smoke)
      setTakeDelivery(take_delivery)
      setCargo(cargoTripDetail)
      setMax2Seats(max2seat)
      setComment(commentTripDetail)
    } else {
      setPassengers(2)
    }
  }, [])

  useEffect(() => {
    if (!car_fetching && !!cars?.length) {
      setCar(cars[0])
      setCarError(null)
    }

    if (carError) {
      showMessage({
        type: 'danger',
        message: t('car_required'),
        duration: config.messageDuration,
      })
    }
  })

  const colors: ThemeColors = route.params.colors

  const onAddCarPress = () => {
    navigation.navigate('CarEditScreen')
  }

  const changePassengersCount = (value: number) => {
    if (passengers + value >= 1) {
      setPassengers(passengers + value)
    }
  }

  // const onPaymentChange = (passenger_payment: PassengerPaymentType) => {
  //   setPassengerPayment(passenger_payment)
  //   setPassengerPaymentError(null)
  // }

  const onSavePress = () => {
    editDetail({
      id: tripDetail?.id,
      request: {
        passengers: passengers,
        animals: animals,
        baby_chair: babyChair,
        can_smoke: canSmoke,
        take_delivery: takeDelivery,
        cargo: cargo,
        max2seat: max2Seats,
      },
    })
    const {
      animals: animalExclude,
      max2seat: max2seatExclude,
      max_passengers: max_passengersExclude,
      baby_chair: baby_chairExclude,
      can_smoke: can_smokeExclude,
      take_delivery: take_deliveryExclude,
      comment: commentExclude,
      cargo: cargoExlude,
      ...restData
    } = tripDetail
    navigation.navigate('Main', {
      screen: 'MyTripsStack',
      params: {
        screen: 'TripDetailScreen',
        params: {
          id,
          updated_data: {
            max_passengers: passengers,
            id: tripDetail?.id,
            animals: animals,
            baby_chair: babyChair,
            can_smoke: canSmoke,
            take_delivery: takeDelivery,
            cargo: cargo,
            max2seat: max2Seats,
            ...restData,
          },
        },
      },
    })
  }

  const onNextStepPress = () => {
    setDetails({
      passengers,
      car,
      animals,
      baby_chair: babyChair,
      can_smoke: canSmoke,
      take_delivery: takeDelivery,
      cargo,
      max2seat: max2Seats,
      passenger_payment: passengerPayment as PassengerPaymentType,
      confirm_booking: confirmBooking,
      comment,
    })

    const isValid = !!car?.id && !!passengerPayment
    if (isValid) {
      navigation.navigate('NewTripPublishScreen')
    } else {
      setCarError(!car?.id ?? null)
      setPassengerPaymentError(!passengerPayment ?? null)
    }
  }

  return (
    <Screen
      title={t('trip_detail_screen_name')}
      contentContainerStyle={styles.contentContainer}
      step={isEdit ? '' : [4, 5]}
      onGoBackPress={() => {
        isEdit
          ? navigation.navigate('Main', {
            screen: 'MyTripsStack',
            params: {
              screen: 'TripDetailScreen',
              params: { id },
            },
          })
          : navigation.goBack()
      }}
    >
      <Text style={[styles.title, { color: colors.text.title }]}>{t('passengers_count')}</Text>
      <Counter style={styles.contentMargin} value={passengers} onChange={changePassengersCount} />

      <Text style={[styles.title, styles.titleMargin, { color: colors.text.title }]}>{t('car_describe')}</Text>
      <View style={styles.contentMargin}>
        {!!car && <ListItem style={styles.car.card} car={car} onPress={() => setShowCarSelectModal(true)} />}
        <Selector style={styles.car.addCar} text={t('add_car')} onPress={onAddCarPress} selected icon={'plus_large'} />
      </View>

      <Text style={[styles.title, styles.titleMargin, { color: colors.text.title }]}>{t('comfort')}</Text>
      <View style={styles.contentMargin}>
        <Switch
          style={[styles.comfort.row, styles.comfort.rowMargin]}
          selected={animals}
          type={'checkbox'}
          rightText={t('allow_animals')}
          onChange={(anim) => setAnimals(anim)}
        />
        <Switch
          style={[styles.comfort.row, styles.comfort.rowMargin]}
          selected={babyChair}
          type={'checkbox'}
          rightText={t('has_baby_chair')}
          onChange={(baby_chair) => setBabyChair(baby_chair)}
        />
        <Switch
          style={[styles.comfort.row, styles.comfort.rowMargin]}
          selected={canSmoke}
          type={'checkbox'}
          rightText={t('allow_smoke')}
          onChange={(can_smoke) => setCanSmoke(can_smoke)}
        />
        <Switch
          style={[styles.comfort.row, styles.comfort.rowMargin]}
          selected={takeDelivery}
          type={'checkbox'}
          rightText={t('ready_take_delivery')}
          onChange={(take_delivery) => setTakeDelivery(take_delivery)}
        />
        <Switch
          style={[styles.comfort.row, styles.comfort.rowMargin]}
          selected={cargo}
          type={'checkbox'}
          rightText={t('allow_cargo')}
          onChange={(c) => setCargo(c)}
        />
        <Switch
          style={styles.comfort.row}
          selected={max2Seats}
          type={'checkbox'}
          rightText={t('max_2_behind')}
          onChange={(max_2_seats) => setMax2Seats(max_2_seats)}
        />
      </View>

      {/* <Text style={[styles.title, styles.titleMargin, { color: colors.text.title }]}>{t('passenger_payment')}</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{t('passenger_payment_description')}</Text>
        <View style={[styles.payment.container, styles.contentMargin]}>
          <Selector
            style={styles.flex}
            text={t('cash')}
            selected={passenger_payment === 'cash'}
            onPress={() => this.onPaymentChange('cash')}
          />
          <Selector
            style={[styles.flex, { marginLeft: 9 }]}
            text={t('card')}
            selected={passenger_payment === 'card'}
            onPress={() => this.onPaymentChange('card')}
          />
        </View>

        <Text style={[styles.title, styles.titleMargin, { color: colors.text.title }]}>
          {t('confirm_booking_question')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {t('confirm_booking_question_description')}
        </Text>
        <View style={[styles.payment.container, styles.contentMargin]}>
          <Selector
            style={styles.flex}
            text={t('confirm_yes')}
            selected={confirm_booking}
            onPress={() => this.setState({ confirm_booking: true })}
          />
          <Selector
            style={[styles.flex, { marginLeft: 9 }]}
            text={t('confirm_no')}
            selected={!confirm_booking}
            onPress={() => this.setState({ confirm_booking: false })}
          />
        </View> */}

      <Text style={[styles.title, styles.titleMargin, { color: colors.text.title }]}>{t('trip_comment')}</Text>
      <TextInput
        style={styles.contentMargin}
        value={comment}
        onChange={(c) => setComment(c)}
        multiline
        placeholder={t('new_trip_comment_placeholder')}
      />

      <Button
        style={styles.nextStepButton} text={t(isEdit ? 'save' : 'continue')}
        onPress={isEdit ? onSavePress : onNextStepPress} />

      <Modal isVisible={showCarSelectModal} onClose={() => setShowCarSelectModal(false)} header={t('select_car')}>
        {cars?.map((c, index) => (
          <ListItem
            key={index.toString()}
            style={styles.car.item}
            car={c}
            onPress={() => {
              setShowCarSelectModal(false)
              setCar(c)
            }}
          />
        ))}
      </Modal>
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  cars: state.cars.cars,
  car_fetching: state.cars.fetching,
})

const mapDispatchToProps = {
  setDetails: newTripSetDetailsAction,
  getCars: carsRequestAction,
  editDetail: detailUpdateAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTripDetailScreen)

const styles = {
  flex: {
    flex: 1,
  } as ViewStyle,
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  } as ViewStyle,
  title: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  } as TextStyle,
  subtitle: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
  } as TextStyle,
  titleMargin: {
    marginTop: 32,
  } as ViewStyle,
  contentMargin: {
    marginTop: 16,
  } as ViewStyle,
  comfort: {
    row: {
      paddingVertical: 4,
    } as ViewStyle,
    rowMargin: {
      marginBottom: 8,
    } as ViewStyle,
  },
  payment: {
    container: {
      flexDirection: 'row',
    } as ViewStyle,
  },
  car: {
    card: {
      marginBottom: 16,
    } as ViewStyle,
    addCar: {} as ViewStyle,
    item: {
      marginVertical: 3,
    } as ViewStyle,
  },
  nextStepButton: {
    marginTop: 48,
    borderRadius: 10,
  } as ViewStyle,
}
