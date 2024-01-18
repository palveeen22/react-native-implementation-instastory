import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, TextStyle, FlatList, View, TouchableOpacity, ViewStyle } from 'react-native'
import { Icon, InfoModal, Screen, ScreenStyles, SearchTripsEmptyImage, TripInfo } from '../components'
import { t } from '../localization'
import { ThemeColors, font } from '../theme'
import moment from 'moment'
import 'moment/locale/ru'
import { tripSearchRequestAction } from '../store/redux/trip'
import { CitySuggestType, RouteType, TripInfoType } from '../types'
import { getScrollOffset } from '../services'

moment().locale('ru')

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

const SearchTripResultsScreen: React.FC<Props> = ({
  error,
  search_filters,
  searchTripScreenRequest,
  page,
  limit,
  total,
  route,
  navigation,
  fetching,
  searchResult,
  filtersApplied,
  currency,
  searchRequest,
}) => {
  const [showEmptyModal, setShowEmptyModal] = useState<boolean>(false)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const [contentHeight, setContentHeight] = useState<number>(0)

  useEffect(() => {
    onRefresh()
  }, [])

  useEffect(() => {
    if (!fetching && !error && searchResult?.length === 0) {
      setShowEmptyModal(true)
    } else if (!fetching && !error && searchResult?.length !== 0) {
      setShowEmptyModal(false)
    }
  }, [fetching, error, searchResult])

  useEffect(() => {
    onRefresh()
  }, [search_filters])

  const onFilterPress = () => {
    navigation.navigate('SearchTripFilterScreen')
  }

  const onRefresh = () => {
    getPagination(1)
  }

  const getPagination = (_page?: number) => {
    const { departure, destination, date } = route.params

    if (!fetching && (!!_page || page * limit < total)) {
      searchTripScreenRequest({
        departure,
        destination,
        start: departure.id,
        end: destination.id,
        date: date,
        cargo: search_filters?.cargo ? 1 : 0,
        take_delivery: search_filters?.take_delivery ? 1 : 0,
        max2seat: search_filters?.max2seat ? 1 : 0,
        animals: search_filters?.animals ? 1 : 0,
        baby_chair: search_filters?.baby_chair ? 1 : 0,
        can_smoke: search_filters?.can_smoke ? 1 : 0,
        order_by: search_filters?.orderBy,
        time: search_filters?.time,
        page: _page || page + 1,
      })
    }
  }

  const goMainSearchPage = () => {
    navigation.goBack()
  }

  const onTripPress = (trip: TripInfoType) => {
    navigation.navigate('Main', {
      screen: 'MyTripsStack',
      params: {
        screen: 'TripDetailScreen',
        params: { id: trip.id },
      },
    })
  }
  const departure: CitySuggestType = route.params.departure
  const destination: CitySuggestType = route.params.destination
  const date: string = route.params.date

  const resultItem = (item: TripInfoType, index: number, prevItem?: TripInfoType) => {
    const colors: ThemeColors = route.params.colors
    const startTime = item.rides[0]?.start.datetime
    const prevStartTime = prevItem?.rides[0]?.start.datetime
    const hasNewDate =
      !prevStartTime || moment(startTime).format('YYYY-MM-DD') !== moment(prevStartTime).format('YYYY-MM-DD')

    return (
      <View style={styles.horizontalMargin}>
        {!!hasNewDate && (
          <Text style={[styles.label, index > 0 && styles.labelMargin, { color: colors.text.default }]}>
            {moment(startTime).format('DD.MM.YY')}
          </Text>
        )}
        <TripInfo
          type={'tripSearch'}
          trip={item}
          onPress={onTripPress}
          currency={currency}
          searchDeparture={searchRequest?.departure}
          searchDestination={searchRequest.destination}
        />
      </View>
    )
  }

  return (
    <Screen
      scrollOffset={scrollOffset}
      enableScroll={false}
      title={departure.main_text + ' \u2014 ' + destination.main_text}
      rightIconName={'filter'}
      onRightIconPress={onFilterPress}
      badge={filtersApplied}
      fetching={fetching}
      contentHeight={contentHeight}
    >
      {!fetching ? (
        <>
          <View
            style={[
              styles.horizontalMargin,
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

          <FlatList
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            data={searchResult}
            onScroll={(e) => setScrollOffset(getScrollOffset(e))}
            scrollEventThrottle={1}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => resultItem(item, index, searchResult[index - 1])}
            onEndReachedThreshold={0.5}
            onEndReached={() => getPagination()}
            onRefresh={onRefresh}
            refreshing={fetching}
            onContentSizeChange={(w, cH) => setContentHeight(cH)}
          />
          <InfoModal
            isVisible={showEmptyModal}
            title={t('no_trip_this_day')}
            text={t('see_rides_another_day')}
            image={<SearchTripsEmptyImage />}
            buttons={[
              {
                text: t('main_page'),
                type: 'secondary',
                onPress: goMainSearchPage,
              },
            ]}
          />
        </>
      ) : (
        <></>
      )}
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => {
  const departure: CitySuggestType = ownProps.route.params.departure
  const destination: CitySuggestType = ownProps.route.params.destination
  const searchResult: TripInfoType[] = state.trip.search_response?.map((trip) => {
    const departureIndex = trip.rides.findIndex((subride) => subride.start.id === departure?.id)
    const destinationIndex = trip.rides.findIndex((subride) => subride.end.id === destination?.id)
    const rides: RouteType[] = trip.rides.filter(
      (subride, index) => index >= departureIndex && index <= destinationIndex
    )
    return { ...trip, rides }
  })
  return {
    searchResult,
    searchRequest: state.trip.search_request,
    filtersApplied: !!state.trip.search_filters,
    currency: state.countries.country?.currency_code,
    search_filters: state.trip.search_filters,
    fetching: state.trip.search_fetching,
    error: state.trip.search_error,
    page: state.trip.search_page,
    limit: state.trip.search_limit,
    total: state.trip.search_total,
  }
}
const mapDispatchToProps = {
  searchTripScreenRequest: tripSearchRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripResultsScreen)

const styles = {
  horizontalMargin: {
    marginHorizontal: 16,
  } as ViewStyle,
  label: {
    fontFamily: font(600),
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 24,
  } as TextStyle,
  labelMargin: {
    marginTop: 24,
  } as ViewStyle,
  separator: {
    height: 16,
  } as ViewStyle,
  contentContainer: {
    ...ScreenStyles,
    flexGrow: 1,
  } as ViewStyle,
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
