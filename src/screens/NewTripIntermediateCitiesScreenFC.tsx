import React, { useCallback, useEffect, useState } from 'react'
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

const NewTripIntermediateCitiesScreen: React.FC<Props> = ({
  getIntermediateCities,
  intermediateCities,
  route,
  navigation,
  updateIntermediateCities,
  getIntermediateSuggests,
  citiesSuggest,
  max_intermediate,
}) => {
  const [intermediateSessionToken, setIntermediateSessionToken] = useState<Nullable<string>>(null)
  const [tempIntermediateCity, setTempIntermediateCity] = useState<Nullable<string>>(null)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [listHeaderHeight, setListHeaderHeight] = useState<number>(0)
  const [listFooterHeight, setListFooterHeight] = useState<number>(0)
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [scrollOffset, setScrollOffset] = useState<number>(0)

  useEffect(() => {
    const { screenName } = route.params

    navigation.addListener('beforeRemove', () => {
      screenName('NewTripScreen')
    })

    screenName('NewTripIntermediateCitiesScreen')

    const start_city_id = intermediateCities[0].id
    const end_city_id = intermediateCities[1].id
    getIntermediateCities({ start_city_id, end_city_id })
  }, [])

  useEffect(() => {
    const _imageHeight = contentHeight - listHeaderHeight - listFooterHeight
    if (!!contentHeight && !!listHeaderHeight && !!listFooterHeight && _imageHeight !== imageHeight) {
      setImageHeight(_imageHeight)
    }
    if (intermediateSessionToken) {
      getIntermediateSuggest('')
    }
  })

  const addIntermediateCityFromTips = useCallback((city: CitySuggestType) => {
    addIntermediateCity({ ...city, sessionToken: uuid.v4().toString() })
  }, [])

  const onIntermediateCitySuggestPress = useCallback((city: CitySuggestType) => {
    addIntermediateCity({
      ...city,
      sessionToken: intermediateSessionToken,
    })
    setIntermediateSessionToken(null)
    setTempIntermediateCity(null)
  }, [])

  const colors: ThemeColors = route.params.colors
  if (!intermediateCities) {
    return null
  }

  const isEdited = intermediateCities.length > 2 || !!intermediateCities.filter((city) => !!city.place).length

  const addIntermediateCity = (city: PlaceSuggestType) => {
    const cities = [...(intermediateCities || [])]
    const index = cities?.length ? cities?.length - 1 : 0
    cities.splice(index, 0, city)
    updateIntermediateCities({ cities })
  }

  const getIntermediateSuggest = (input: string) => {
    getIntermediateSuggests({
      input,
      detail: 0,
      sessionToken: intermediateSessionToken,
    })
    setTempIntermediateCity(input)
  }

  const onNextStepPress = () => {
    navigation.navigate('NewTripIntermediatePriceScreen')
  }

  const onIntermediateOrderChange = ({ data, from, to }: DragEndParams<IntermediateCityType>) => {
    if (!(to === 0 || to === intermediateCities.length - 1)) {
      updateIntermediateCities({ cities: data })
    }
  }

  const onPlaceSelect = (item: IntermediateCityType, place: Nullable<PlaceSuggestType>) => {
    const _intermediateCities = [...intermediateCities]
    const waypoint = _intermediateCities.find((city) => city.id === item.id)
    waypoint.place = place
    updateIntermediateCities({ cities: _intermediateCities })
  }

  const onAddIntermediatePress = () => {
    if (intermediateCities.length < max_intermediate + 1) {
      setIntermediateSessionToken(uuid.v4().toString())
    } else {
      showMessage({
        type: 'danger',
        message: t('max_intermediate', [max_intermediate + 1]),
        duration: config.messageDuration,
      })
    }
  }

  const onIntermediateDeletePress = (city: IntermediateCityType) => {
    const _intermediateCities = [...intermediateCities]
    const index = _intermediateCities.findIndex((item) => item.id === city.id)
    _intermediateCities.splice(index, 1)
    updateIntermediateCities({ cities: _intermediateCities })
  }

  const renderItem: React.FC<RenderItemParams<IntermediateCityType>> = (params) => {
    const { item, drag, isActive, index, isFirst, isLast, length } = params
    const { colors } = useTheme()
    const date = moment(item.datetime)
      .utcOffset(item.utcOffset || 0)
      .format('DD MMMM, dd, H:mm')

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
            onDragEnd={onIntermediateOrderChange}
            onScrollOffsetChange={(scrollOffset) => setScrollOffset(scrollOffset)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, drag, isActive, index }) =>
              renderItem({
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
            onContentSizeChange={(w, contentHeight) => setContentHeight(contentHeight)}
            ListHeaderComponent={() => (
              <View
                style={[styles.contentContainer, styles.header]}
                onLayout={(e) => {
                  const _listHeaderHeight = e.nativeEvent.layout.height
                  if (listHeaderHeight !== _listHeaderHeight) {
                    setListHeaderHeight(_listHeaderHeight)
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
                        <Pressable key={index.toString()} onPress={() => addIntermediateCityFromTips(city)}>
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
                <Selector icon={'plus_large'} text={t('add_intermediate')} selected onPress={onAddIntermediatePress} />
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
              setListFooterHeight(_listFooterHeight)
            }
          }}
        >
          <Button text={t(isEdited ? 'continue' : 'skip')} onPress={onNextStepPress} />
        </View>
        <Modal
          header={t('adding_intermediate')}
          isVisible={!!intermediateSessionToken}
          onClose={() => setIntermediateSessionToken(null)}
          fullScreen
        >
          <View style={styles.modal.content}>
            <TextInput
              style={{ marginBottom: 8 }}
              value={tempIntermediateCity}
              onChange={getIntermediateSuggest}
              backgroundColor={'transparent'}
              borderColor={colors.textInput.background}
              debug
            />
            {citiesSuggest?.map((city, index) => (
              <SuggestItem
                key={index.toString()}
                style={[styles.modal.item, { borderColor: colors.border }]}
                item={{ ...city, _name_: city.description }}
                onPress={() => onIntermediateCitySuggestPress(city)}
              />
            ))}
          </View>
        </Modal>
      </Screen>
    )
  }

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
              <Icon name={'dragg'} size={40} color={colors.icon.secondary} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  )
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
      width: 40,
      marginLeft: 10,
      justifyContent: 'space-between',
    } as ViewStyle,
    trashContainer: {
      opacity: 0.5,
    } as ViewStyle,
    draggContainer: {
      borderWidth: 1,
      borderRadius: 20,
    } as ViewStyle,
  },
  footer: {
    marginVertical: 8,
  } as ViewStyle,
}
