import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, TextStyle, ViewStyle } from 'react-native'
import { Button, ListItem, Screen, TripInfo, Modal, TextInput, TripFooter, InfoModal } from '../components'
import { t } from '../localization'
import { font, isSmallScreen, ThemeColors } from '../theme'
import moment from 'moment'
import 'moment/locale/ru'
import { CarType, Nullable, RouteType, TripInfoType } from '../types'
import { newTripPublishRequestAction, newTripSetDetailsAction } from '../store/redux/newTrip'
import BookingSuccessImage from '../components/BookingSuccessImage'
moment().locale('ru')
import AppMetrica from 'react-native-appmetrica'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  showSuccessModal: boolean
  showCarSelectModal: boolean
  showDetailInfo: boolean
  tripDetail: Nullable<TripInfoType>
}

class NewTripPublishScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showSuccessModal: false,
      showCarSelectModal: false,
      showDetailInfo: true,
      tripDetail: null,
    }
  }

  componentDidMount(): void {
    const tripDetail = this.createTrip()
    this.setState({ tripDetail })
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { publish_fetching, publish_error } = this.props

    if (prevProps.publish_fetching && !publish_fetching && !publish_error) {
      this.setState({ showSuccessModal: true })
    }
  }

  render() {
    const { route, trip_details, cars, currency } = this.props
    const colors: ThemeColors = route.params.colors
    const { car, comment } = trip_details || {}
    const { showSuccessModal, showCarSelectModal, showDetailInfo, tripDetail } = this.state
    const totalCost = tripDetail?.rides.reduce((value, ride) => value + ride.price, 0)

    return (
      <Screen title={t('new_trip_create')} contentContainerStyle={styles.contentContainer} step={[5, 5]}>
        <TripInfo
          type={'tripDetail'}
          style={{ marginTop: 24 }}
          trip={tripDetail}
          role={'driver'}
          showDetailInfo={showDetailInfo}
          onDetailInfoStateChange={this.onDetailInfoStateChange}
        />

        <TripFooter
          style={[styles.tripInfo.container, { backgroundColor: colors.background.lightgrey }]}
          type={'tripsPublished'}
          status={'onCreate'}
          passengersConfimBooked={0}
          price={totalCost}
          currency={currency}
          max_passengers={tripDetail?.max_passengers}
        />

        <Text style={[styles.label, { color: colors.text.title }]}>{t('car')}:</Text>
        <ListItem car={car} onPress={() => this.setState({ showCarSelectModal: true })} />

        <Text style={[styles.label, { color: colors.text.title }]}>{t('trip_comment_short')}</Text>
        <TextInput value={comment} onChange={this.onCommentChange} multiline />

        <Button style={styles.publishButton} text={t('publish_trip')} onPress={this.onPublishButtonPress} />

        <InfoModal
          image={<BookingSuccessImage />}
          isVisible={showSuccessModal}
          title={t('trip_bublished')}
          text={t('trip_bublished_description')}
          buttons={[{ text: t('to_main'), onPress: this.onGotoMainPress }]}
        />

        <Modal
          isVisible={showCarSelectModal}
          onClose={() => this.setState({ showCarSelectModal: false })}
          header={t('select_car')}
        >
          {cars?.map((car, index) => (
            <ListItem key={index.toString()} style={styles.car.item} car={car} onPress={() => this.onCarChange(car)} />
          ))}
        </Modal>
      </Screen>
    )
  }

  onCarChange = (car: CarType) => {
    const { setDetails } = this.props
    setDetails({ car })
    const tripDetail = this.createTrip()
    this.setState({ showCarSelectModal: false, tripDetail })
  }

  onCommentChange = (comment: string) => {
    const { publish_fetching, publish_error } = this.props
    const { showSuccessModal } = this.state

    if (!publish_fetching && !publish_error && !showSuccessModal) {
      const { setDetails } = this.props
      setDetails({ comment })
      const tripDetail = this.createTrip()
      this.setState({ tripDetail })
    }
  }

  onPublishButtonPress = () => {
    this.props.publishTrip()
    const tripDetails = this.props.trip_details
    const { tripDetail } = this.state

    AppMetrica.reportEvent('newTrip', {
      tripDetails: {
        ...tripDetails,
        start_city: tripDetail?.rides[0]?.start?.main_text,
        end_city: tripDetail?.rides[0]?.end.main_text,
      },
    })
  }

  onGotoMainPress = () => {
    const { navigation } = this.props
    navigation.replace('Main')
  }

  onDetailInfoStateChange = () => {
    const { showDetailInfo } = this.state
    this.setState({ showDetailInfo: !showDetailInfo })
  }

  createTrip = () => {
    const { profile, intermediate_cities, trip_details } = this.props
    const rides: RouteType[] = []
    for (let index = 1; index < intermediate_cities.length; index++) {
      const start = intermediate_cities[index - 1]
      const end = intermediate_cities[index]
      rides.push({
        start: {
          id: start.id,
          description: start.description,
          main_text: start.main_text,
          secondary_text: start.secondary_text,
          place: start.place || null,
          datetime: start.datetime,
          sessionToken: start.sessionToken,
          tz_offset: start.utcOffset,
        },
        end: {
          id: end.id,
          description: end.description,
          main_text: end.main_text,
          secondary_text: end.secondary_text,
          place: end.place || null,
          datetime: end.datetime,
          sessionToken: end.sessionToken,
          tz_offset: end.utcOffset,
        },
        price: end.waypoint.price,
        passengers: [],
      })
    }
    const tripDetail: TripInfoType = {
      id: null,
      status: 'onCreate',
      max_passengers: trip_details?.passengers,
      driver: profile,
      car: trip_details?.car,
      passengers: [],
      comment: trip_details?.comment,
      baby_chair: trip_details?.baby_chair,
      max2seat: trip_details?.max2seat,
      cargo: trip_details?.cargo,
      take_delivery: trip_details?.take_delivery,
      animals: trip_details?.animals,
      can_smoke: trip_details?.can_smoke,
      rides,
      passenger_payment: null,
    }
    return tripDetail
  }
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  profile: state.user.profile,
  intermediate_cities: state.newTrip.intermediate_cities,
  trip_details: state.newTrip.details,
  cars: state.cars.cars,
  publish_fetching: state.newTrip.publish_trip_fetching,
  publish_error: state.newTrip.publish_trip_error,
  currency: state.countries.country?.currency_code,
})

const mapDispatchToProps = {
  setDetails: newTripSetDetailsAction,
  publishTrip: newTripPublishRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTripPublishScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
  title: {
    alignSelf: 'center',
    fontFamily: font(700),
    fontSize: 18,
  } as TextStyle,
  step: {
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 8,
    fontFamily: font(),
    fontSize: 14,
  } as TextStyle,
  label: {
    marginTop: 32,
    marginBottom: 16,
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  } as TextStyle,
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
  car: {
    card: {
      marginBottom: 16,
    } as ViewStyle,
    addCar: {} as ViewStyle,
    item: {
      marginVertical: 3,
    } as ViewStyle,
  },
  publishButton: {
    marginTop: isSmallScreen() ? 20 : 22,
    borderRadius: 10,
  } as ViewStyle,
}
