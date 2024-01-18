import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { TextStyle, ViewStyle, View, Text } from 'react-native'
import { Button, Screen, Switch } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { TripSearchFilterType } from '../types'
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

class SearchTripFilterScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { ...initialState }
  }

  componentDidMount(): void {
    const { filters } = this.props
    if (filters) {
      this.setState({ ...filters })
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { cargo, take_delivery, max2seat, animals, baby_chair, can_smoke, orderBy, time } = this.state
    const { filters_fetching, filters_error } = this.props

    const hasNewFilters =
      prevState.animals !== animals ||
      prevState.baby_chair !== baby_chair ||
      prevState.can_smoke !== can_smoke ||
      prevState.cargo !== cargo ||
      prevState.max2seat !== max2seat ||
      prevState.take_delivery !== take_delivery
    if (hasNewFilters) {
      const { updateFilters, search_request } = this.props
      updateFilters({
        start: search_request.start,
        end: search_request.end,
        date: search_request.date,
        cargo: cargo ? 1 : 0,
        take_delivery: take_delivery ? 1 : 0,
        max2seat: max2seat ? 1 : 0,
        animals: animals ? 1 : 0,
        baby_chair: baby_chair ? 1 : 0,
        can_smoke: can_smoke ? 1 : 0,
        order_by: orderBy,
      })
    }

    if (prevProps.filters_fetching && !filters_fetching && !filters_error) {
      const { times } = this.props
      if (!times[time]) {
        this.setState({ time: null })
      }
    }
  }

  render() {
    const colors: ThemeColors = this.props.route.params.colors
    const { orderBy, time, animals, baby_chair, can_smoke, take_delivery, cargo, max2seat } = this.state
    const { times } = this.props

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
            onChange={() => this.setState({ orderBy: 'earlier' })}
          />
          <Switch
            style={styles.value}
            type={'radiobutton'}
            selected={orderBy === 'cheaper'}
            rightText={t('trip_filter_cheaper')}
            onChange={() => this.setState({ orderBy: 'cheaper' })}
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
              onChange={() => this.onTimeChange(index ? item : null)}
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
            onChange={(animals) => this.setState({ animals })}
          />
          <Switch
            style={styles.value}
            selected={baby_chair}
            type={'checkbox'}
            rightText={t('has_baby_chair')}
            onChange={(baby_chair) => this.setState({ baby_chair })}
          />
          <Switch
            style={styles.value}
            selected={can_smoke}
            type={'checkbox'}
            rightText={t('allow_smoke')}
            onChange={(can_smoke) => this.setState({ can_smoke })}
          />
          <Switch
            style={styles.value}
            selected={take_delivery}
            type={'checkbox'}
            rightText={t('ready_take_delivery')}
            onChange={(take_delivery) => this.setState({ take_delivery })}
          />
          <Switch
            style={styles.value}
            selected={cargo}
            type={'checkbox'}
            rightText={t('allow_cargo')}
            onChange={(cargo) => this.setState({ cargo })}
          />
          <Switch
            style={styles.value}
            selected={max2seat}
            type={'checkbox'}
            rightText={t('max_2_behind')}
            onChange={(max2seat) => this.setState({ max2seat })}
          />
        </View>

        <View style={styles.buttons.container}>
          <Button style={styles.buttons.button} text={t('reset_all')} type={'secondary'} onPress={this.onResetPress} />
          <Button
            disabled={
              !!(times['00:00-06:00'] === 0) &&
              !!(times['06:00-12:00'] === 0) &&
              !!(times['12:00-18:00'] === 0) &&
              !!(times['18:00-00:00'] === 0)
            }
            style={[styles.buttons.button, styles.buttons.leftMargin]}
            text={t('watch')}
            onPress={this.onApplyPress}
          />
        </View>
      </Screen>
    )
  }

  onTimeChange = (time: null | string) => {
    this.setState({ time })
  }

  onResetPress = () => {
    const { applyFilter, navigation } = this.props
    this.setState({ ...initialState })
    applyFilter(null)
    navigation.goBack()
  }

  onApplyPress = () => {
    const { applyFilter, navigation } = this.props
    applyFilter(this.state)
    navigation.goBack()
  }
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
