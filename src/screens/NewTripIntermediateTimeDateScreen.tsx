import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { FlatList, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, DatePicker, Screen, ScreenStyles, TextInput } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { IntermediateCityType } from '../types'
import { newTripUpdateIntermediatePriceAction, timeUpdateAction } from '../store/redux/newTrip'
import moment from 'moment'
import RenderItem from './NewTripIntermediatePriceItem'
import { Nullable } from '../types'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  scrollOffset: number
  contentHeight: number
}

const NewTripIntermediateTimeDateScreen: React.FC<Props> = ({ route, navigation, updatePriceRequest }) => {
  const [showTimePickerModal, setShowTimePickerModal] = useState<boolean>(false)
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false)
  const [date, setDate] = useState<Nullable<string>>(null)
  const [time, setTime] = useState<Nullable<string>>(null)
  const [time_error, setTimeError] = useState<Nullable<boolean>>(null)
  const [date_error, setDateError] = useState<Nullable<boolean>>(null)

  const colors: ThemeColors = route.params.colors
  const { tripDetail } = route.params.params

  const onSavePress = () => {
    updatePriceRequest({
      id: tripDetail?.id,
      request: {
        date,
        time,
      },
    })

    navigation.navigate('Main', {
      screen: 'MyTripsStack',
      params: {
        screen: 'TripDetailScreen',
        params: {
          id: tripDetail?.id,
          updated_data: {
            id: tripDetail?.id,
            ...tripDetail
            // rides: newRides,
            // ...restData,
          },
        },
      },
    })
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
  useEffect(() => {
    setTime(moment(tripDetail?.rides[0]?.start?.datetime).format('HH:mm'))
    setDate(moment(tripDetail?.rides[0]?.start?.datetime).format('YYYY-MM-DD'))
  }, [])

  return (
    <Screen title={t('date_and_time')} contentContainerStyle={[styles.contentContainer]}>
      <View style={{ flex: 1, alignContent: 'space-between' }}>

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

        <Button style={styles.nextStepButton} text={t('save')} onPress={onSavePress} />
      </View>
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  intermediate_cities: state.newTrip.intermediate_cities,
  price_step: state.countries.country?.price_step,
  currency: state.countries.country?.currency_code,
})

const mapDispatchToProps = {
  updatePrice: newTripUpdateIntermediatePriceAction,
  updatePriceRequest: timeUpdateAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTripIntermediateTimeDateScreen)

const styles = {
  element: {
    flexDirection: 'row', // or 'column'
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  item: {
    separator: {
      borderTopWidth: 1,
      marginVertical: 18,
    } as ViewStyle,
  },
  contentContainer: {
    paddingHorizontal: 16,
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
  input: {
    container: {
      marginTop: 1,
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
  labelMargin: {
    marginTop: 24,
  } as ViewStyle,
  border: {
    borderWidth: 1,
    borderRadius: 2,
  } as ViewStyle,
  nextStepButton: {
    marginTop: 45,
    borderRadius: 10,
  } as ViewStyle,
}
