import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { TextStyle, ViewStyle, View, Text } from 'react-native'
import { Button, Screen, Switch } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { TripSearchFilterType, Nullable, TripSearchFilterSort } from '../types'
import { tripSearchSetFilterAction, tripSearchUpdateFiltersRequestAction } from '../store/redux/trip'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State extends TripSearchFilterType {}

const initialState: State = {
  orderBy: 'cheaper',
  time: null,
  animals: false,
  baby_chair: false,
  can_smoke: false,
  take_delivery: false,
  cargo: false,
  max2seat: false,
}

const SearchTripFilterScreen: React.FC<Props> = ({
  filters,
  filters_error,
  filters_fetching,
  updateFilters,
  search_request,
  times,
  route,
  applyFilter,
  navigation,
}) => {
  const [orderBy, setOrderBy] = useState<TripSearchFilterSort>('cheaper')
  const [time, setTime] = useState<Nullable<string>>(null)
  const [animals, setAnimals] = useState<boolean>(false)
  const [babyChair, setBabyChair] = useState<boolean>(false)
  const [canSmoke, setCanSmoke] = useState<boolean>(false)
  const [takeDelivery, setTakeDelivery] = useState<boolean>(false)
  const [cargo, setCargo] = useState<boolean>(false)
  const [max2seat, setMax2seat] = useState<boolean>(false)
  const [filter, setFilter] = useState<TripSearchFilterType>(filters)

  useEffect(() => {
    updateFilters({
      start: search_request.start,
      end: search_request.end,
      date: search_request.date,
      cargo: cargo ? 1 : 0,
      take_delivery: takeDelivery ? 1 : 0,
      max2seat: max2seat ? 1 : 0,
      animals: animals ? 1 : 0,
      baby_chair: babyChair ? 1 : 0,
      can_smoke: canSmoke ? 1 : 0,
      order_by: orderBy,
    })

    if (!filters_fetching && !filters_error) {
      if (!times[time]) {
        setTime(null)
      }
    }
  }, [animals, babyChair, canSmoke, cargo, max2seat, takeDelivery, times])

  const onTimeChange = (time: null | string) => {
    setTime(time)
  }

  const onResetPress = () => {
    setOrderBy('cheaper')
    setTime(null)
    setAnimals(false)
    setBabyChair(false)
    setCanSmoke(false)
    setTakeDelivery(false)
    setCargo(false)
    setMax2seat(false)
    setFilter(filters)
    applyFilter(null)
    navigation.goBack()
  }

  const onApplyPress = () => {
    applyFilter({
      orderBy,
      time,
      animals,
      baby_chair: babyChair,
      can_smoke: canSmoke,
      take_delivery: takeDelivery,
      cargo: cargo,
      max2seat,
    })
    navigation.goBack()
  }

  const colors: ThemeColors = route.params.colors
  return (
    <Screen title={t('filtering')} contentContainerStyle={styles.contentContainer}>
      <View
        style={[
          styles.wrapper,
          {
            borderColor: colors.filterItem.border,
            backgroundColor: colors.filterItem.background,
          },
        ]}
      >
        <Text style={[styles.label, { color: colors.text.default }]}>{t('trip_filter_order')}</Text>
        <Switch
          style={styles.value}
          type={'radiobutton'}
          selected={orderBy === 'earlier'}
          rightText={t('trip_filter_earlier')}
          onChange={() => setOrderBy('earlier')}
        />
        <Switch
          style={styles.value}
          type={'radiobutton'}
          selected={orderBy === 'cheaper'}
          rightText={t('trip_filter_cheaper')}
          onChange={() => setOrderBy('cheaper')}
        />
        {/* <Switch
            style={styles.value}
            type={'radiobutton'}
            selected={orderBy === 'nearest_departure'}
            rightText={t('trip_filter_nearest_departure')}
            onChange={() => this.setState({ orderBy: 'nearest_departure' })}
          /> */}
        {/* <Switch
            style={styles.value}
            type={'radiobutton'}
            selected={orderBy === 'nearest_destination'}
            rightText={t('trip_filter_nearest_destination')}
            onChange={() => this.setState({ orderBy: 'nearest_destination' })}
          /> */}
      </View>

      <View
        style={[
          styles.wrapper,
          {
            borderColor: colors.filterItem.border,
            backgroundColor: colors.filterItem.background,
          },
        ]}
      >
        <Text style={[styles.label, { color: colors.text.default }]}>{t('trip_filter_depatrure_time')}</Text>
        {[t('any_time'), '00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-00:00'].map((item, index) => (
          <Switch
            style={styles.value}
            key={index.toString()}
            type={'radiobutton'}
            selected={(index === 0 && time === null) || item === time}
            rightText={item}
            count={(times || {})[item]}
            onChange={() => onTimeChange(index ? item : null)}
            disabled={index === 0 ? false : !(times || {})[item]}
          />
        ))}
      </View>

      <View
        style={[
          styles.wrapper,
          {
            borderColor: colors.filterItem.border,
            backgroundColor: colors.filterItem.background,
          },
        ]}
      >
        <Text style={[styles.label, { color: colors.text.default }]}>{t('comfort')}</Text>
        <Switch
          style={styles.value}
          selected={animals}
          type={'checkbox'}
          rightText={t('allow_animals')}
          onChange={(a) => setAnimals(a)}
        />
        <Switch
          style={styles.value}
          selected={babyChair}
          type={'checkbox'}
          rightText={t('has_baby_chair')}
          onChange={(baby_chair) => setBabyChair(baby_chair)}
        />
        <Switch
          style={styles.value}
          selected={canSmoke}
          type={'checkbox'}
          rightText={t('allow_smoke')}
          onChange={(can_smoke) => setCanSmoke(can_smoke)}
        />
        <Switch
          style={styles.value}
          selected={takeDelivery}
          type={'checkbox'}
          rightText={t('ready_take_delivery')}
          onChange={(take_delivery) => setTakeDelivery(take_delivery)}
        />
        <Switch
          style={styles.value}
          selected={cargo}
          type={'checkbox'}
          rightText={t('allow_cargo')}
          onChange={(c) => setCargo(c)}
        />
        <Switch
          style={styles.value}
          selected={max2seat}
          type={'checkbox'}
          rightText={t('max_2_behind')}
          onChange={(max2s) => setMax2seat(max2s)}
        />
      </View>

      <View style={styles.buttons.container}>
        <Button style={styles.buttons.button} text={t('reset_all')} type={'secondary'} onPress={onResetPress} />
        <Button
          disabled={
            !!(times['00:00-06:00'] === 0) &&
            !!(times['06:00-12:00'] === 0) &&
            !!(times['12:00-18:00'] === 0) &&
            !!(times['18:00-00:00'] === 0)
          }
          style={[styles.buttons.button, styles.buttons.leftMargin]}
          text={t('watch')}
          onPress={onApplyPress}
        />
      </View>
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  filters: state.trip.search_filters,
  search_request: state.trip.search_request,
  times: state.trip.search_times,
  filters_fetching: state.trip.filters_fetching,
  filters_error: state.trip.filters_error,
})

const mapDispatchToProps = {
  applyFilter: tripSearchSetFilterAction,
  updateFilters: tripSearchUpdateFiltersRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripFilterScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
  wrapper: {
    borderWidth: 1,
    marginBottom: 16,
    padding: 24,
    borderRadius: 2,
  } as ViewStyle,
  label: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 16,
    marginBottom: 4,
  } as TextStyle,
  value: {
    marginTop: 16,
  } as ViewStyle,
  buttons: {
    container: {
      marginTop: 24,
      paddingVertical: 8,
      flexDirection: 'row',
    } as ViewStyle,
    button: {
      flex: 1,
      minHeight: 50,
    } as ViewStyle,
    leftMargin: {
      marginLeft: 8,
    } as ViewStyle,
  },
}
