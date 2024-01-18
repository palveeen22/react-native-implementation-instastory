import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import 'moment/locale/ru'
moment().locale('ru')
import React, { useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { tripInfoTypeView } from './index'
import { WaypointImage } from '..'
import { RoutePointType, RouteType, TripRoleType, TripStatusType } from '../../types'
import TripBodyCityRow from './TripBodyCityRow'

interface TripBodyProps {
  type: tripInfoTypeView
  style?: ViewStyle | ViewStyle[]
  departureTime?: string
  arrivalTime?: string
  status?: TripStatusType
  departure: RoutePointType
  destination: RoutePointType
  distArr: undefined | RouteType[]
  role: TripRoleType
  showDetailInfo?: boolean
}

const TripBody = (props: TripBodyProps) => {
  const { dark, colors } = useTheme()
  const { type, style, departure, destination, distArr, role, showDetailInfo = false, status } = props

  const [heightDetailInfo, setHeightDetailInfo] = useState<number>(0)

  const renderItem = (route: RouteType, routeIndex: number, self: RouteType[]) => {
    const isFirst = routeIndex === 0
    const isLast = routeIndex + 1 === self.length
    const cities: RoutePointType[] = routeIndex === 0 ? [route.start, route.end] : [route.end]

    const departureRouteIndex = distArr.findIndex((ride) => ride.start?.id === departure?.id)
    const destinationRouteIndex = distArr.findIndex((ride) => ride.end?.id === destination?.id)
    const isRouteVisited = routeIndex >= departureRouteIndex && routeIndex <= destinationRouteIndex && showDetailInfo

    return (
      <View key={routeIndex.toString()}>
        {cities.map((city, cityIndex) => {
          const showDeparturePoint = isFirst && cityIndex === 0
          const showDestinationPoint = isLast && cityIndex + 1 === cities.length
          const isFirstVisited = city.id === departure?.id && type === 'tripDetail'
          const isLastVisited = city.id === destination?.id && type === 'tripDetail'

          const isVisited = isRouteVisited || isFirstVisited || isLastVisited || role === 'driver'
          const time =
            isFirstVisited || isLastVisited || type !== 'tripDetail'
              ? moment(city?.datetime)?.utcOffset(city?.tz_offset)?.format('H:mm')
              : null
          const showAddress = type !== 'tripsPublished'
          const address = showAddress && (isFirstVisited || isLastVisited) ? city.place?.main_text : null

          return (
            <TripBodyCityRow
              key={cityIndex.toString()}
              style={[
                styles.cityContainer,
                routeIndex === 0 && cityIndex === 0
                  ? { paddingTop: 0 }
                  : routeIndex === self.length - 1 && cityIndex === cities.length - 1
                    ? { paddingBottom: 0 }
                    : null,
              ]}
              address={address}
              showDeparturePoint={showDeparturePoint}
              isVisited={isVisited}
              isLastVisited={isLastVisited}
              isFirstVisited={isFirstVisited}
              showDestinationPoint={showDestinationPoint}
              city={city}
              time={time}
              isDriver={role === 'driver'}
              showDetailInfo={showDetailInfo}
              type={type}
              status={status}
            />
          )
        })}
      </View>
    )
  }

  if (!departure || !destination) {
    return null
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.detailInfo} onLayout={(e) => setHeightDetailInfo(e.nativeEvent.layout.height)}>
        <WaypointImage
          visible={!!heightDetailInfo}
          shape={'line'}
          height={heightDetailInfo}
          backgroundColor={'transparent'}
          tintColor={
            status === 'cancelled'
              ? colors.waypointImage.cancelled
              : type === 'tripSearch'
                ? colors.waypointImage.active
                : role === 'driver'
                  ? colors.waypointImage.active
                  : type === 'tripDetail'
                    ? colors.waypointImage.inactive
                    : colors.waypointImage.active
          }
          zIndex={1}
        />
        {distArr?.map((item, index, self) => renderItem(item, index, self))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  image: {
    height: 42,
    width: 7,
    marginTop: 25,
  },
  detailInfo: {
    flex: 1,
  },
  cityContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
})

export default React.memo(TripBody)
