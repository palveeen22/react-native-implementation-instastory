import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { FlatList, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Screen, ScreenStyles } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import { IntermediateCityType } from '../types'
import { newTripUpdateIntermediatePriceAction, priceUpdateAction } from '../store/redux/newTrip'
import { getScrollOffset } from '../services'
import RenderItem from './NewTripIntermediatePriceItem'
import useDataEdit from '../helpers/helper'
import DataEdit from '../helpers/helper'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  scrollOffset: number
  contentHeight: number
}

const NewTripIntermediatePriceScreen: React.FC<Props> = ({
  intermediate_cities,
  price_step,
  currency,
  route,
  updatePrice,
  navigation,
  editPrice,
  trip_info_update,
}) => {
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [edit_intermediate_cities, set_edit_intermediate_cities] = useState<any>([])

  const colors: ThemeColors = route.params.colors
  const { isEdit, id, tripDetail } = route.params

  const onPriceChange = (item: IntermediateCityType, price: number) => {
    if (price >= 0) {
      if (isEdit) {
        const _cities = [...(edit_intermediate_cities || [])]
        const index = _cities.map((item) => item.id).indexOf(item.id)
        _cities[index] = { ...item, waypoint: { ...item.waypoint, price } }

        set_edit_intermediate_cities(_cities)
      } else {
        updatePrice({ ...item, waypoint: { ...item.waypoint, price } })
      }
    }
  }

  const onContinuePress = () => {
    navigation.navigate('NewTripDetailScreen')
  }

  const onSavePress = () => {
    const citiesRequest = [...(edit_intermediate_cities || [])]
    const sendPrice = []
    citiesRequest.forEach((e, i) => {
      if (i !== 0) {
        sendPrice.push({
          price: e?.waypoint?.price,
        })
      }
    })

    editPrice({
      id: tripDetail?.id,
      rides: sendPrice,
    })

    const { rides: ridesExclude, ...restData } = tripDetail
    const newRides = [...ridesExclude].map((e, i) => {
      return {
        ...e,
        price: sendPrice[i]?.price
      }
    })

    navigation.navigate('Main', {
      screen: 'MyTripsStack',
      params: {
        screen: 'TripDetailScreen',
        params: {
          id,
          updated_data: {
            id,
            rides: newRides,
            ...restData,
          },
        },
      },
    })
  }
  useEffect(() => {
    const tripLength = tripDetail?.rides
    const tripUpdateLength = trip_info_update?.rides
    if (tripLength?.length) {
      const result = DataEdit(tripUpdateLength?.length ? tripUpdateLength : tripLength)
      set_edit_intermediate_cities(result)
    }
  }, [])

  return (
    <Screen
      title={t(isEdit ? 'price' : 'trip_detail_screen_name')}
      step={isEdit ? '' : [3, 5]}
      enableScroll={false}
      scrollOffset={scrollOffset}
      contentHeight={contentHeight}
      onGoBackPress={() => {
        isEdit
          ? navigation.navigate('Main', {
            screen: 'MyTripsStack',
            params: {
              screen: 'TripDetailScreen',
              params: { id },
            },
          })
          : navigation.goBack()
      }}
    >
      <FlatList
        data={isEdit ? edit_intermediate_cities : intermediate_cities}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={() => (
          <View>
            <Text style={[styles.label, styles.marginHorizontal, styles.marginTop, { color: colors.text.default }]}>
              {t(isEdit ? 'cost_of_travel_plan_text' : 'trip_price')}
            </Text>
          </View>
        )}
        bounces={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <RenderItem
            item={item}
            index={index}
            self={isEdit ? edit_intermediate_cities : intermediate_cities}
            onPriceChange={onPriceChange}
            priceStep={10}
            // priceStep={price_step}
            currency={currency || 'P'}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => (
          <View style={[styles.item.separator, styles.marginHorizontal, { borderColor: colors.border }]} />
        )}
        ListFooterComponent={() => (
          <View style={[styles.footer, styles.marginHorizontal]}>
            <Button
              style={{
                borderRadius: 10,
              }}
              text={t(isEdit ? 'save' : 'continue')}
              onPress={isEdit ? onSavePress : onContinuePress}
            />
          </View>
        )}
        onScroll={(e) => setScrollOffset(getScrollOffset(e))}
        scrollEventThrottle={1}
        onContentSizeChange={(w, contentHeight) => setContentHeight(contentHeight)}
      />
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  intermediate_cities: state.newTrip.intermediate_cities,
  price_step: state.countries.country?.price_step,
  currency: state.countries.country?.currency_code,
  trip_info_update: state.trip.trip_info_update,
})

const mapDispatchToProps = {
  updatePrice: newTripUpdateIntermediatePriceAction,
  editPrice: priceUpdateAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTripIntermediatePriceScreen)

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
    paddingBottom: 8,
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
}
