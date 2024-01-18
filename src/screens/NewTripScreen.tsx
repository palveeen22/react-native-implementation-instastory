import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Screen, TextInput, DatePicker } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { CitySuggestType, Nullable } from '../types'
import moment from 'moment'
import { newTripUpdateIntermediateRequestAction } from '../store/redux/newTrip'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  departure: Nullable<CitySuggestType>
  destination: Nullable<CitySuggestType>
  date: Nullable<string>
  time: Nullable<string>
  departure_error: Nullable<boolean>
  destination_error: Nullable<boolean>
  time_error: Nullable<boolean>
  date_error: Nullable<boolean>
  showDatePickerModal: boolean
  showTimePickerModal: boolean
  departureDontVoid: boolean
  destinationDontVoid: boolean
}

const NewTripScreen: React.FC<Props> = ({ route, routePossible, updateIntermediateCities, navigation }) => {
  const [departure, setDeparture] = useState<Nullable<CitySuggestType>>(null)
  const [destination, setDestination] = useState<Nullable<CitySuggestType>>(null)
  const [date, setDate] = useState<Nullable<string>>(null)
  const [time, setTime] = useState<Nullable<string>>(null)
  const [departure_error, setDepartureError] = useState<Nullable<boolean>>(null)
  const [destination_error, setDestinationError] = useState<Nullable<boolean>>(null)
  const [time_error, setTimeError] = useState<Nullable<boolean>>(null)
  const [date_error, setDateError] = useState<Nullable<boolean>>(null)
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false)
  const [showTimePickerModal, setShowTimePickerModal] = useState<boolean>(false)
  const [departureDontVoid, setDepartureDontVoid] = useState<boolean>(false)
  const [destinationDontVoid, setDestinationDontVoid] = useState<boolean>(false)

  const { colors } = route.params

  const onNextStepPress = () => {
    if (isTripValid()) {
      const datetime = moment(date)
        .hours(+time.split(':')[0])
        .minutes(+time.split(':')[1])
        .utc()
        .format('YYYY-MM-DDTHH:mm+00:00')
      updateIntermediateCities({
        cities: [{ ...departure, datetime }, destination],
      })
      navigation.navigate('NewTripIntermediateCitiesScreen')
    } else {
      setDepartureError(departure ? null : true)
      setDestinationError(destination ? null : true)
      setTimeError(time ? null : true)
      setDateError(date ? null : true)
    }
  }

  const isTripValid = () => {
    return !!destination && !!departure && !!date && !!time
  }

  const onAllCitysSelected = () => {
    const departureReady = departure && !departure_error ? true : false
    const destinationReady = destination && !destination_error ? true : false

    if (departureReady && destinationReady) {
      updateIntermediateCities({ cities: [departure, destination] })
    }
  }

  const onDepartureSelect = (_departure: CitySuggestType) => {
    setDepartureDontVoid(true)
    setDeparture(_departure)
    setDepartureError(null)
    if (departureDontVoid || destinationDontVoid) {
      onAllCitysSelected()
    }
  }

  const onDestinationSelect = (_destination: CitySuggestType) => {
    setDestinationDontVoid(true)
    setDestination(_destination)
    setDestinationError(null)
    if (departureDontVoid || destinationDontVoid) {
      onAllCitysSelected()
    }
  }

  const onDateChange = (_date: Date) => {
    setDate(moment(_date).format('YYYY-MM-DD'))
    setShowDatePickerModal(false)
    setDateError(null)
  }

  const onTimeChange = (_date: Date) => {
    setTime(moment(_date).format('HH:mm'))
    setShowTimePickerModal(false)
    setTimeError(null)
  }

  return (
    <Screen title={t('new_trip_create')} step={[1, 5]} contentContainerStyle={styles.contentContainer} hideGoBack>
      <Text style={[styles.label, { color: colors.text.title }]}>{t('new_trip_depatrure')}</Text>
      <TextInput
        style={styles.input.container}
        textStyle={styles.input.text}
        value={departure?.main_text}
        type={'citySuggest'}
        onSuggestSelect={(city) => onDepartureSelect(city as CitySuggestType)}
        error={departure_error}
        placeholder={'Москва'}
      />

      <Text style={[styles.label, styles.labelMargin, { color: colors.text.title }]}>{t('new_trip_destination')}</Text>
      <TextInput
        style={styles.input.container}
        textStyle={styles.input.text}
        value={destination?.main_text}
        type={'citySuggest'}
        onSuggestSelect={(city) => onDestinationSelect(city as CitySuggestType)}
        error={destination_error}
        placeholder={'Казань'}
      />

      <Text style={[styles.label, styles.labelMargin, { color: colors.text.title }]}>{t('new_trip_date')}</Text>
      <View
        style={[
          styles.input.container,
          styles.border,
          {
            borderColor: showDatePickerModal ? colors.textInput.border : 'transparent',
          },
        ]}
      >
        <TextInput
          value={date ? moment(date).format('DD.MM.YYYY') : null}
          onPress={() => setShowDatePickerModal(true)}
          editable={false}
          error={date_error}
          placeholder={moment().format('DD.MM.YYYY')}
        />
      </View>

      <Text style={[styles.label, styles.labelMargin, { color: colors.text.title }]}>{t('new_trip_time')}</Text>
      <View
        style={[
          styles.input.container,
          styles.border,
          {
            borderColor: showTimePickerModal ? colors.textInput.border : 'transparent',
          },
        ]}
      >
        <TextInput
          value={time}
          onPress={() => setShowTimePickerModal(true)}
          editable={false}
          error={time_error}
          placeholder={'12:30'}
        />
      </View>

      <Button
        style={styles.nextStepButton}
        text={t('continue')}
        onPress={onNextStepPress}
        disabled={routePossible === null && time && date ? false : true}
      />

      <DatePicker
        modal
        mode={'date'}
        minimumDate={new Date(moment().format('YYYY-MM-DDT00:00:00+00:00'))}
        isVisible={showDatePickerModal}
        date={new Date(date || Date.now())}
        onConfirm={onDateChange}
        onCancel={() => setShowDatePickerModal(false)}
        locale={'ru'}
        confirmText={t('accept')}
        cancelText={t('cancel')}
        title={t('new_trip_date')}
      />

      <DatePicker
        modal
        mode={'time'}
        isVisible={showTimePickerModal}
        date={new Date(time ? moment(time, 'HH:mm').utc().format('YYYY-MM-DDTHH:mm:ss+00:00') : Date.now())}
        onConfirm={onTimeChange}
        onCancel={() => setShowTimePickerModal(false)}
        locale={'ru'}
        confirmText={t('accept')}
        cancelText={t('cancel')}
        title={t('new_trip_time')}
      />
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  routePossible: state.newTrip.intermediate_cities_error,
})

const mapDispatchToProps = {
  updateIntermediateCities: newTripUpdateIntermediateRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTripScreen)

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
    fontFamily: font(700),
    fontSize: 16,
    lineHeight: 20,
  } as TextStyle,
  labelMargin: {
    marginTop: 24,
  } as ViewStyle,
  input: {
    container: {
      marginTop: 16,
    } as ViewStyle,
    text: {
      fontFamily: font(700),
      fontSize: 14,
    } as TextStyle,
    time: {
      flex: 1,
    } as ViewStyle,
    alignCenter: {
      textAlign: 'center',
    } as TextStyle,
  },
  nextStepButton: {
    marginTop: 48,
    borderRadius: 10,
  } as ViewStyle,
  border: {
    borderWidth: 1,
    borderRadius: 2,
  } as ViewStyle,
}
