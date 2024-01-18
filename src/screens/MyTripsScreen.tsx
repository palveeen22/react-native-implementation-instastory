import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, ViewStyle, ImageStyle, TextStyle, FlatList, View } from 'react-native'
import { Screen, ScreenStyles, TripInfo, MyTripsImage, MyTripTypeSelector, Button, ListItem } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { TripInfoType } from '../types'
import Modal from '../components/Modal'

import moment from 'moment'
import 'moment/locale/ru'
import { getScrollOffset } from '../services'
import {
  tripCancelBookingRequestAction,
  tripCancelRequestAction,
  tripsBookedArchiveRequestAction,
  tripsBookedRequestAction,
  tripsPublishedArchiveRequestAction,
  tripsPublishedRequestAction,
} from '../store/redux/trip'
import { useTheme } from '@react-navigation/native'
moment().locale('ru')

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type MyTripsScreenProps = ScreenProps & StateProps & {}

const MyTripsScreen: React.FC<MyTripsScreenProps> = ({
  publishedList,
  publishedFetching,
  bookedFetching,
  bookedList,
  route,
  currency,
  publishedPage,
  publishedLimit,
  publishedTotal,
  bookedPage,
  bookedLimit,
  bookedTotal,

  publishedListArchive,
  publishedFetchingArchive,
  publishedPageArchive,
  publishedLimitArchive,
  publishedTotalArchive,
  bookedListArchive,
  bookedFetchingArchive,
  bookedPageArchive,
  bookedTotalArchive,
  bookedLimitArchive,

  getPublished,
  getPublishedArchive,
  getBooked,
  getBookedArchive,

  navigation,
  cancelTrip,
  cancelBooking,
}) => {
  const [publishedSelected, setPublishedSelected] = useState<boolean>(false)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [reachBottom, setReachBottom] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const colors: ThemeColors = route.params.colors
  const data = publishedSelected ? publishedList : bookedList
  const dataArchive = publishedSelected ? publishedListArchive : bookedListArchive
  const { dark } = useTheme()

  useEffect(() => {
    onRefresh()
  }, [])

  useEffect(() => {
    onRefresh()
  }, [publishedSelected])

  const onTripDetailPress = (trip: TripInfoType) => {
    setShowModal(false)
    navigation.navigate('MyTripsStack', {
      screen: 'TripDetailScreen',
      params: { id: trip.id },
    })
  }

  const onRefresh = () => {
    getPagination(1)
    getPaginationArchive(1)
  }

  const getPagination = (_page?: number) => {
    const page = publishedSelected ? publishedPage : bookedPage
    const limit = publishedSelected ? publishedLimit : bookedLimit
    const total = publishedSelected ? publishedTotal : bookedTotal
    const fetching = publishedSelected ? publishedFetching : bookedFetching
    const load = publishedSelected ? getPublished : getBooked
    if (!fetching && (!!_page || page * limit < total)) {
      load({
        type: publishedSelected ? 'driver' : 'passenger',
        page: _page || page + 1,
      })
    }
  }

  const getPaginationArchive = (_page?: number) => {
    const page = publishedSelected ? publishedPageArchive : bookedPageArchive
    const limit = publishedSelected ? publishedLimitArchive : bookedLimitArchive
    const total = publishedSelected ? publishedTotalArchive : bookedTotalArchive
    const fetching = publishedSelected ? publishedFetchingArchive : bookedFetchingArchive
    const loadArchive = publishedSelected ? getPublishedArchive : getBookedArchive
    if (!fetching && (!!_page || page * limit < total)) {
      loadArchive({
        type: publishedSelected ? 'driver' : 'passenger',
        page: _page || page + 1,
      })
    }
  }

  const onCancelConfirm = (ride_id) => {
    if (publishedSelected) {
      cancelTrip({ ride_id })
    } else {
      cancelBooking({ ride_id })
    }
    onRefresh()
  }
  let hasOngoingTrip = false
  data?.forEach((trip) => {
    if (trip.status === 'active') {
      hasOngoingTrip = true
    }
  });

  let shownRecentTrip = Infinity

  return (
    <Screen
      hideHeader
      reachBottom={reachBottom}
      scrollOffset={scrollOffset}
      contentHeight={contentHeight}
      enableScroll={false}
      hideGoBack
    >
      <FlatList
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
          const endPosition = contentOffset.y + layoutMeasurement.height;

          // Check if we have reached the bottom
          if (endPosition >= contentSize.height) {
            setReachBottom(true)
          } else {
            setReachBottom(false)
          }

          setScrollOffset(getScrollOffset(e))
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => getPagination()}
        scrollEventThrottle={1}
        refreshing={publishedSelected ? publishedFetching : bookedFetching}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={[styles.marginHorizontal, styles.marginTop]}>
            <MyTripsImage style={styles.image} />
            <Text style={[primaryText, { color: colors.text.default }]}>{t('your_trip')}</Text>
            <MyTripTypeSelector
              style={styles.listSwitcher}
              isPublished={publishedSelected}
              onChange={(value) => {
                setPublishedSelected(value)
                setScrollOffset(0)
              }}
            />
            {!hasOngoingTrip ? (
              <View>
                <Text style={[styles.textCreateTrip, { color: dark ? 'white' : 'black' }]}>{publishedSelected ? t('create_trip') : t('find_trip')}</Text>
                <Button
                  text={publishedSelected ? t('create_trip_botton') : t('search_tour')}
                  type={'secondary'}
                  style={[styles.button, { marginTop: 20 }]}
                  onPress={() => navigation.navigate(publishedSelected ? 'NewTripStack' : 'SearchTripStack')}
                />
              </View>
            ) : (<></>)}
          </View>
        }
        data={data}
        renderItem={({ item, index }) => {
          if ((item?.status === 'cancelled' || item?.status === 'finished') && index < shownRecentTrip) {
            shownRecentTrip = index
          }

          return (
            <View>
              {(item?.status === 'cancelled' || item?.status === 'finished') &&
                shownRecentTrip === index ? (
                <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                  <Text style={{ fontWeight: '600', fontSize: 16, color: dark ? 'white' : 'black' }}>Недавние поездки</Text>
                </View>
              ) : (
                <></>
              )}
              <TripInfo
                type={publishedSelected ? 'tripsPublished' : 'tripsBooking'}
                style={[styles.marginHorizontal, { marginTop: 24 }]}
                trip={item}
                onPress={onTripDetailPress}
                onCancelConfirm={onCancelConfirm}
                currency={currency}
                role={publishedSelected ? 'driver' : 'passenger'}
              />
              {index === data.length - 1 ? (
                <ListItem
                  style={{ marginTop: 20 }}
                  key={0} text={t('archive_trip')}
                  onPress={() => setShowModal(true)} />
              ) : (<View></View>)}
            </View>
          )

        }}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={(w, contentH) => setContentHeight(contentH)}
      />
      <Modal
        onClose={() => setShowModal(false)}
        header={'Архив опубликованных поездок'}
        fullScreen
        closeButton
        isVisible={showModal}>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={() => getPaginationArchive()}
          scrollEventThrottle={1}
          // refreshing={publishedSelected ? publishedFetching : bookedFetching}
          // onRefresh={onRefresh}
          data={dataArchive}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TripInfo
                  type={publishedSelected ? 'tripsPublished' : 'tripsBooking'}
                  style={[styles.marginHorizontal, { marginTop: 24 }]}
                  trip={item}
                  onPress={onTripDetailPress}
                  // onCancelConfirm={onCancelConfirm}
                  currency={currency}
                  role={publishedSelected ? 'driver' : 'passenger'}
                />
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={(w, contentH) => setContentHeight(contentH)}
        />
      </Modal>
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  publishedList: state.trip.published,
  publishedFetching: state.trip.published_fetching,
  publishedPage: state.trip.published_page,
  publishedLimit: state.trip.published_limit,
  publishedTotal: state.trip.published_total,
  bookedList: state.trip.booked,
  bookedFetching: state.trip.booked_fetching,
  bookedPage: state.trip.booked_page,
  bookedTotal: state.trip.booked_total,
  bookedLimit: state.trip.booked_limit,

  publishedListArchive: state.trip.published_archive,
  publishedFetchingArchive: state.trip.published_fetching_archive,
  publishedPageArchive: state.trip.published_page_archive,
  publishedLimitArchive: state.trip.published_limit_archive,
  publishedTotalArchive: state.trip.published_total_archive,
  bookedListArchive: state.trip.booked_archive,
  bookedFetchingArchive: state.trip.booked_fetching_archive,
  bookedPageArchive: state.trip.booked_page_archive,
  bookedTotalArchive: state.trip.booked_total_archive,
  bookedLimitArchive: state.trip.booked_limit_archive,

  currency: state.countries.country?.currency_code,
})

const mapDispatchToProps = {
  getPublished: tripsPublishedRequestAction,
  getPublishedArchive: tripsPublishedArchiveRequestAction,
  getBooked: tripsBookedRequestAction,
  getBookedArchive: tripsBookedArchiveRequestAction,
  cancelTrip: tripCancelRequestAction,
  cancelBooking: tripCancelBookingRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTripsScreen)

const primaryText = {
  fontFamily: font(700),
  fontSize: 18,
  textAlign: 'center',
  marginTop: 58,
} as TextStyle

const styles = {
  marginHorizontal: {
    marginHorizontal: 16,
  } as ViewStyle,
  textCreateTrip: {
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    height: 50,
    flex: 1,
    borderRadius: 10,
  },
  marginTop: {
    marginTop: ScreenStyles.paddingTop,
  } as ViewStyle,
  contentContainer: {
    flexGrow: 1,
    paddingBottom: ScreenStyles.paddingBottom,
  } as ViewStyle,
  image: {
    alignSelf: 'center',
    marginTop: 50,
  } as ImageStyle,
  listSwitcher: {
    marginTop: 43,
  } as ViewStyle,
}
