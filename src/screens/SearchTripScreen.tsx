import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { ViewStyle, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import { Button, Screen, TextInput, Alert, DatePicker, Icon } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { CitySuggestType, Nullable } from '../types'
import { tripSearchSetFilterAction } from '../store/redux/trip'
import AppMetrica from 'react-native-appmetrica'
import InstaStory from 'react-native-insta-story'

import moment from 'moment'
import 'moment/locale/ru'
import { userStoriesRequestSaga } from '../store/saga/user'
import { userStories } from '../store/redux/user'
moment().locale('ru')

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  departure: Nullable<CitySuggestType>
  destination: Nullable<CitySuggestType>
  date: Nullable<string>
  departure_error: Nullable<boolean>
  destination_error: Nullable<boolean>
  date_error: Nullable<boolean>
  showDatePickerModal: boolean
}

const SearchTripScreen: React.FC<Props> = ({ navigation, route, country, stories, filters, applyFilter, getStory }) => {
  const [departure, setDeparture] = useState<Nullable<CitySuggestType>>({
    description: 'Москва, Россия',
    id: 'ChIJybDUc_xKtUYRTM9XV8zWRD0',
    main_text: 'Москва',
    secondary_text: 'Россия',
  })
  const [destination, setDestination] = useState<Nullable<CitySuggestType>>({
    description: 'Казань, Россия',
    id: 'ChIJmc2sfCutXkERZYyttbl3y38',
    main_text: 'Казань',
    secondary_text: 'Россия',
  })

  const [date, setDate] = useState<Nullable<string>>(moment(new Date().toString()).format('YYYY-MM-DD'))
  const [departure_error, setDepartureError] = useState<Nullable<boolean>>(null)
  const [destination_error, setDestinationError] = useState<Nullable<boolean>>(null)
  const [date_error, setDateError] = useState<Nullable<boolean>>(null)
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false)

  const isFocused = navigation.isFocused()

  useEffect(() => {
    if (isFocused) {
      resetFilters()
    }
  })

  const getInstagramStory = () => {
    getStory()
  }

  useEffect(() => {
    getInstagramStory()
  }, [])

  const colors: ThemeColors = route.params.colors
  const newMessagesCount = 1

  const onMessagePress = () => {
    Alert.alert('onMessagePress')
  }

  const onDateChange = (date: Date) => {
    setDate(moment(date).format('YYYY-MM-DD'))
    setShowDatePickerModal(false)
    setDateError(null)
  }

  const goSearchTripScreen = () => {
    if (!!departure && !!destination && !!date) {
      // const reportData = `${departure.main_text} => ${destination.main_text} ${date}`
      AppMetrica.reportEvent('searchTrip', {
        reportData: {
          start_city: departure.main_text,
          end_city: destination.main_text,
          date,
        },
      })
      navigation.navigate('SearchTripResultsScreen', {
        departure,
        destination,
        date,
      })
    } else {
      setDepartureError(!departure)
      setDestinationError(!destination)
      setDateError(!date)
    }
  }

  const onDepartureSelect = (_departure: CitySuggestType) => {
    setDeparture(_departure)
    setDepartureError(null)
  }

  const onDestinationSelect = (_destination: CitySuggestType) => {
    setDestination(_destination)
    setDestinationError(null)
  }

  const resetFilters = () => {
    if (filters) {
      applyFilter(null)
    }
  }

  console.log(stories, '<<<==== THIS IS STORIES')

  const data = [
    {
      user_id: 1,
      user_image: 'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
      user_name: '',
      stories: [
        {
          story_id: 1,
          story_image: 'https://image.freepikш.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image: 'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
        },
      ],
    },
    {
      user_id: 2,
      user_image:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: '',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
        },
      ],
    },
  ]

  return (
    <Screen
      title={t('trip_search')}
      rightIconName={'message'}
      // onRightIconPress={this.onMessagePress} // раскомментировать для отображения кнопки чата
      badge={newMessagesCount}
      contentContainerStyle={styles.contentContainer}
      hideGoBack
    >
      {stories?.length && (
        <InstaStory
          renderCloseComponent={({ item, onPress }) => (
            <View style={{ flexDirection: 'row' }}>
              {/* <Button onPress={() => { }}>Share</Button> */}
              <TouchableOpacity onPress={onPress}>
                <Text style={{ fontSize: 20 }}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          data={stories}
          duration={10}
        />
      )}
      <Text style={[styles.label, { color: colors.text.default }]}>{t('new_trip_depatrure')}</Text>
      <TextInput
        style={styles.input.container}
        textStyle={styles.input.text}
        value={departure?.main_text}
        type={'citySuggest'}
        onSuggestSelect={(city) => onDepartureSelect(city as CitySuggestType)}
        error={departure_error}
        placeholder={'Москва'}
      // searchInPlace={country}
      />

      <Text style={[styles.label, styles.labelMargin, { color: colors.text.default }]}>
        {t('new_trip_destination')}
      </Text>
      <TextInput
        style={styles.input.container}
        textStyle={styles.input.text}
        value={destination?.main_text}
        type={'citySuggest'}
        onSuggestSelect={(city) => onDestinationSelect(city as CitySuggestType)}
        error={destination_error}
        placeholder={'Казань'}
      // searchInPlace={country}
      />

      <Text style={[styles.label, styles.labelMargin, { color: colors.text.default }]}>{t('new_trip_date')}</Text>
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
          value={date ? moment(date).format('DD.MM.YY') : null}
          onPress={() => setShowDatePickerModal(true)}
          editable={false}
          placeholder={moment().format('DD.MM.YY')}
          error={date_error}
        />
      </View>

      <Button style={styles.searchButton} onPress={goSearchTripScreen} text={t('search_trip')} />
      <View
        style={[
          styles.input.container,
          styles.border,
          {
            marginTop: 20,
            borderRadius: 4,
            borderColor: 'transparent',
            backgroundColor: 'rgba(147, 116, 203, 0.12)', // 12% transparent purple color
            padding: 6,
            flexDirection: 'row',
            gap: 6,
          },
        ]}
      >
        <Icon
          name={'info'}
          // style={styles.icon}
          // size={iconSize}
          color={'#4D2186'}
        />
        <View style={{ flexDirection: 'column', gap: 5 }}>
          <Text style={{ color: '#2F2A2A' }}>Подтвердите личность, чтобы забронировать поездку</Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ color: '#4D2186' }}>Перейти</Text>
          </TouchableOpacity>
        </View>
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
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  country: state.countries.country?.name,
  filters: state.trip.search_filters,
  stories: state.user.stories,
})

const mapDispatchToProps = {
  applyFilter: tripSearchSetFilterAction,
  getStory: userStories,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripScreen)

const commonStyles = {
  defaultInputTextView: {
    height: 60,
    marginTop: 3,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    alignContent: 'space-around',
    flexWrap: 'wrap',
  } as ViewStyle,
}

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
  label: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  } as TextStyle,
  labelMargin: {
    marginTop: 24,
  } as ViewStyle,
  questionText: {
    fontFamily: font(700),
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 22,
  } as TextStyle,
  firstTextInput: {
    ...commonStyles.defaultInputTextView,
    marginTop: 25,
  } as ViewStyle,
  searchButton: {
    marginTop: 40,
    minHeight: 50,
    borderRadius: 10,
  } as ViewStyle,
  switchWhereToButton: {
    position: 'absolute',
    top: 125,
    right: 39,
    borderRadius: 150,
    height: 44,
    width: 44,
  } as ViewStyle,
  inputText: {
    fontFamily: font(400),
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.6,
  } as TextStyle,
  defaultMainTextInput: {
    fontFamily: font(700),
    fontSize: 14,
    letterSpacing: 0.64,
  } as TextStyle,
  input: {
    container: {} as ViewStyle,
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
  border: {
    borderWidth: 1,
    borderRadius: 2,
  } as ViewStyle,
}
