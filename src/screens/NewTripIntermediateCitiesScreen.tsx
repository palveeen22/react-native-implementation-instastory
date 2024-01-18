import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Icon, Modal, Screen, ScreenStyles, Selector, TextInput, WaypointImage } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { CitySuggestType, IntermediateCityType, Nullable, PlaceSuggestType } from '../types'
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams as _RenderItemParams,
} from 'react-native-draggable-flatlist'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import 'moment/locale/ru'
moment().locale('ru')
import {
  newTripGetIntermediateSuggestRequestAction,
  newTripIntermediateTipsRequestAction,
  newTripUpdateIntermediateRequestAction,
} from '../store/redux/newTrip'
import uuid from 'react-native-uuid'
import { showMessage } from 'react-native-flash-message'
import config from '../config'
import SuggestItem from '../components/TextInput/SuggestItem'

type RenderItemParams<T> = _RenderItemParams<T> & {
  isFirst: boolean
  isLast: boolean
  length: number
}

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  intermediateSessionToken: Nullable<string>
  tempIntermediateCity: Nullable<string>
  contentHeight: number
  listHeaderHeight: number
  listFooterHeight: number
  imageHeight: number
  scrollOffset: number
}

class NewTripIntermediateCitiesScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      intermediateSessionToken: null,
      tempIntermediateCity: null,
      contentHeight: 0,
      listHeaderHeight: 0,
      listFooterHeight: 0,
      imageHeight: 0,
      scrollOffset: 0,
    }
  }

  componentDidMount(): void {
    const { getIntermediateCities, intermediateCities, route, navigation } = this.props
    const { screenName } = route.params

    navigation.addListener('beforeRemove', () => {
      screenName('NewTripScreen')
    })

    screenName('NewTripIntermediateCitiesScreen')

    const start_city_id = intermediateCities[0].id
    const end_city_id = intermediateCities[1].id
    getIntermediateCities({ start_city_id, end_city_id })
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { contentHeight, listHeaderHeight, listFooterHeight, imageHeight, intermediateSessionToken } = this.state
    const _imageHeight = contentHeight - listHeaderHeight - listFooterHeight
    if (!!contentHeight && !!listHeaderHeight && !!listFooterHeight && _imageHeight !== imageHeight) {
      this.setState({ imageHeight: _imageHeight })
    }

    if (!prevState.intermediateSessionToken && !!intermediateSessionToken) {
      this.getIntermediateSuggest('')
    }
  }

  render() {
    const colors: ThemeColors = this.props.route.params.colors
    const { intermediateCitiesTips, citiesSuggest, intermediateCities } = this.props
    if (!intermediateCities) {
      return null
    }

    const {
      intermediateSessionToken,
      tempIntermediateCity,
      listHeaderHeight,
      listFooterHeight,
      scrollOffset,
      imageHeight,
    } = this.state
    const isEdited = intermediateCities.length > 2 || !!intermediateCities.filter((city) => !!city.place).length

    return (
      <Screen
        title={t('add_intermediate_cities')}
        step={[2, 5]}
        enableScroll={false}
        scrollOffset={scrollOffset}
        contentHeight={imageHeight}
      >
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={intermediateCities}
            onDragEnd={this.onIntermediateOrderChange}
            onScrollOffsetChange={(scrollOffset) => this.setState({ scrollOffset })}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, drag, isActive, index }) =>
              this.renderItem({
                item,
                drag,
                isActive,
                index,
                isFirst: index === 0,
                isLast: intermediateCities.length === index + 1,
                length: intermediateCities.length || 0,
              })
            }
            bounces={false}
            onContentSizeChange={(w, contentHeight) => this.setState({ contentHeight })}
            ListHeaderComponent={() => (
              <View
                style={[styles.contentContainer, styles.header]}
                onLayout={(e) => {
                  const _listHeaderHeight = e.nativeEvent.layout.height
                  if (listHeaderHeight !== _listHeaderHeight) {
                    this.setState({ listHeaderHeight: _listHeaderHeight })
                  }
                }}
              >
                <Text style={[styles.description, { color: colors.text.secondary }]}>
                  {t('intermediate_cities_description')}
                </Text>
                {!!intermediateCitiesTips?.length && (
                  <View style={styles.intermediate.container}>
                    <Text style={[styles.intermediate.recommend, { color: colors.text.default }]}>
                      {t('we_recommend')}
                    </Text>
                    <View style={styles.intermediate.citiesContainer}>
                      {intermediateCitiesTips.map((city, index) => (
                        <Pressable key={index.toString()} onPress={() => this.addIntermediateCityFromTips(city)}>
                          <Text
                            style={[
                              styles.intermediate.city,
                              {
                                color: colors.text.default,
                                borderColor: colors.border,
                              },
                            ]}
                          >
                            {city.main_text}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
                <Selector
                  icon={'plus_large'}
                  text={t('add_intermediate')}
                  selected
                  onPress={this.onAddIntermediatePress}
                />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={[styles.contentContainer, { height: 24 }]} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </View>

        <View
          style={[styles.contentContainer, styles.footer]}
          onLayout={(e) => {
            const _listFooterHeight = e.nativeEvent.layout.height
            if (listFooterHeight !== _listFooterHeight) {
              this.setState({ listFooterHeight: _listFooterHeight })
            }
          }}
        >
          <Button
            style={{
              borderRadius: 10,
            }}
            text={t(isEdited ? 'continue' : 'skip')}
            onPress={this.onNextStepPress} />
        </View>

        <Modal
          header={t('adding_intermediate')}
          isVisible={!!intermediateSessionToken}
          onClose={() => this.setState({ intermediateSessionToken: null })}
          fullScreen
        >
          <View style={styles.modal.content}>
            <TextInput
              style={{ marginBottom: 8 }}
              value={tempIntermediateCity}
              onChange={this.getIntermediateSuggest}
              backgroundColor={'transparent'}
              borderColor={colors.textInput.background}
              debug
            />
            {citiesSuggest?.map((city, index) => (
              <SuggestItem
                key={index.toString()}
                style={[styles.modal.item, { borderColor: colors.border }]}
                item={{ ...city, _name_: city.description }}
                onPress={() => this.onIntermediateCitySuggestPress(city)}
              />
            ))}
          </View>
        </Modal>
      </Screen>
    )
  }

  addIntermediateCity = (city: PlaceSuggestType) => {
    const { intermediateCities, updateIntermediateCities } = this.props
    const cities = [...(intermediateCities || [])]
    const index = cities?.length ? cities?.length - 1 : 0
    cities.splice(index, 0, city)
    updateIntermediateCities({ cities })
  }

  addIntermediateCityFromTips = (city: CitySuggestType) => {
    this.addIntermediateCity({ ...city, sessionToken: uuid.v4().toString() })
  }

  getIntermediateSuggest = (input: string) => {
    const { getIntermediateSuggests } = this.props
    const { intermediateSessionToken } = this.state
    getIntermediateSuggests({
      input,
      detail: 0,
      sessionToken: intermediateSessionToken,
    })
    this.setState({ tempIntermediateCity: input })
  }

  onIntermediateCitySuggestPress = (city: CitySuggestType) => {
    const { intermediateSessionToken } = this.state
    this.addIntermediateCity({
      ...city,
      sessionToken: intermediateSessionToken,
    })
    this.setState({
      intermediateSessionToken: null,
      tempIntermediateCity: null,
    })
  }

  onNextStepPress = () => {
    this.props.navigation.navigate('NewTripIntermediatePriceScreen')
  }

  renderItem = (params: RenderItemParams<IntermediateCityType>) => {
    const { imageHeight } = this.state
    const { item, drag, isActive, index, isFirst, isLast, length } = params
    const { colors } = useTheme()
    const date = moment(item.datetime)
      .utcOffset(item.utcOffset || 0)
      .format('DD MMMM, dd, H:mm')

    return (
      <View style={[styles.contentContainer, styles.cities.row]}>
        <WaypointImage
          visible={isFirst && !!imageHeight}
          shape={'line'}
          height={imageHeight}
          tintColor={colors.waypointImage.visitedLine}
          overflow={'visible'}
        />
        <WaypointImage visible={isFirst} type={'firstPoint'} tintColor={colors.waypointImage.visitedLine} />
        <WaypointImage
          visible={isLast}
          type={'lastPoint'}
          tintColor={colors.waypointImage.visitedLine}
          backgroundColor={colors.waypointImage.visitedLine}
        />
        <WaypointImage visible={!isFirst && !isLast} tintColor={colors.waypointImage.visitedLine} />
        <View style={styles.cities.content}>
          <Text style={[styles.cities.city, { color: colors.text.default }]}>{item.main_text}</Text>
          <Text style={[styles.cities.date, { color: colors.text.secondary }]}>{date}</Text>
          <TextInput
            style={styles.cities.addressContainer}
            textStyle={styles.cities.address}
            value={item.place?.main_text}
            backgroundColor={'transparent'}
            type={'citySuggest'}
            searchInPlace={item.description}
            sessionToken={item.sessionToken}
            onSuggestSelect={(place) => this.onPlaceSelect(item, place as Nullable<PlaceSuggestType>)}
            placeholder={t('new_trip_address_palceholder')}
          />
        </View>
        <View style={styles.cities.icons}>
          {!isFirst && !isLast && (
            <>
              <Pressable style={styles.cities.trashContainer} onPress={() => this.onIntermediateDeletePress(item)}>
                <Icon name={'trash'} size={40} color={colors.icon.secondary} />
              </Pressable>
              <Pressable
                style={[styles.cities.draggContainer, { borderColor: colors.border }]}
                onPressIn={drag}
                disabled={isActive}
              >
                <Icon name={'dragg'} size={48} color={colors.icon.secondary} />
              </Pressable>
            </>
          )}
        </View>
      </View>
    )
  }

  onIntermediateOrderChange = ({ data, from, to }: DragEndParams<IntermediateCityType>) => {
    const { intermediateCities, updateIntermediateCities } = this.props
    if (!(to === 0 || to === intermediateCities.length - 1)) {
      updateIntermediateCities({ cities: data })
    }
  }

  onIntermediateDeletePress = (city: IntermediateCityType) => {
    const { intermediateCities, updateIntermediateCities } = this.props
    const _intermediateCities = [...intermediateCities]
    const index = _intermediateCities.findIndex((item) => item.id === city.id)
    _intermediateCities.splice(index, 1)
    updateIntermediateCities({ cities: _intermediateCities })
  }

  onPlaceSelect = (item: IntermediateCityType, place: Nullable<PlaceSuggestType>) => {
    const { intermediateCities, updateIntermediateCities } = this.props
    const _intermediateCities = [...intermediateCities]
    const waypoint = _intermediateCities.find((city) => city.id === item.id)
    waypoint.place = place
    updateIntermediateCities({ cities: _intermediateCities })
  }

  onAddIntermediatePress = () => {
    const { max_intermediate, intermediateCities } = this.props
    if (intermediateCities.length < max_intermediate + 1) {
      this.setState({ intermediateSessionToken: uuid.v4().toString() })
    } else {
      showMessage({
        type: 'danger',
        message: t('max_intermediate', [max_intermediate + 1]),
        duration: config.messageDuration,
      })
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => {
  const intermediateCities = state.newTrip.intermediate_cities
  const intermediateCitiesIDs = intermediateCities?.map((city) => city.id) || []
  const intermediateCitiesTips = state.newTrip.intermediate_tips?.filter(
    (tip) => !intermediateCitiesIDs.includes(tip.id)
  )
  return {
    intermediateCitiesTips,
    citiesSuggest: state.newTrip.intermadiate_suggests,
    intermediateCities,
    intermediateCities_fetching: state.newTrip.intermediate_cities_fetching,
    max_intermediate: state.countries.country.max_points_count,
  }
}

const mapDispatchToProps = {
  updateIntermediateCities: newTripUpdateIntermediateRequestAction,
  getIntermediateSuggests: newTripGetIntermediateSuggestRequestAction,
  getIntermediateCities: newTripIntermediateTipsRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTripIntermediateCitiesScreen)

const styles = {
  contentContainer: {
    marginHorizontal: 16,
  } as ViewStyle,
  contentContainerStyle: {
    paddingTop: ScreenStyles.paddingTop,
    paddingBottom: 40,
  } as ViewStyle,
  header: {
    paddingBottom: 40,
  } as ViewStyle,
  description: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 40,
  } as TextStyle,
  intermediate: {
    container: {
      marginBottom: 24,
    } as ViewStyle,
    recommend: {
      fontFamily: font(),
      fontSize: 12,
      lineHeight: 16,
      marginBottom: 8,
    } as TextStyle,
    citiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    } as ViewStyle,
    city: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      marginRight: 8,
      marginTop: 8,
      fontFamily: font(),
      fontSize: 12,
      lineHeight: 16,
    } as TextStyle,
  },
  modal: {
    content: {
      paddingHorizontal: 16,
    } as ViewStyle,
    item: {
      marginBottom: 5,
    } as ViewStyle,
    itemText: {
      flex: 1,
      fontFamily: font(),
      fontSize: 14,
      lineHeight: 18,
    } as TextStyle,
  },
  cities: {
    row: {
      flexDirection: 'row',
      paddingLeft: 23,
    } as ViewStyle,
    content: {
      flex: 1,
    } as ViewStyle,
    city: {
      fontFamily: font(600),
      fontSize: 14,
      lineHeight: 16,
    } as TextStyle,
    date: {
      marginTop: 4,
      fontFamily: font(),
      fontSize: 12,
      lineHeight: 16,
    } as TextStyle,
    addressContainer: {
      marginTop: 10,
    } as ViewStyle,
    address: {} as TextStyle,
    icons: {
      width: 50,
      marginLeft: 10,
      justifyContent: 'space-between',
    } as ViewStyle,
    trashContainer: {
      opacity: 0.5,
      marginLeft: 5
    } as ViewStyle,
    draggContainer: {
      borderWidth: 1,
      borderRadius: 30,
    } as ViewStyle,
  },
  footer: {
    marginVertical: 8,
  } as ViewStyle,
}
