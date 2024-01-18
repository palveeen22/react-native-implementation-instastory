import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { tripInfoTypeView } from '.'
import { WaypointImage } from '..'
import { font } from '../../theme'
import { RoutePointType, TripStatusType } from '../../types'

interface TripBodyCityRowProps {
  style?: ViewStyle | ViewStyle[]
  address: string
  showDeparturePoint: boolean
  isVisited: boolean
  isLastVisited: boolean
  isFirstVisited: boolean
  showDestinationPoint: boolean
  city: RoutePointType
  time: string
  isDriver: boolean
  showDetailInfo: boolean
  type?: tripInfoTypeView
  status?: TripStatusType
}

export default function (props: TripBodyCityRowProps) {
  const { dark, colors } = useTheme()
  const [containerHeight, setContainerHeight] = useState<number>(0)
  const {
    style,
    address,
    showDeparturePoint,
    isVisited,
    isLastVisited,
    isFirstVisited,
    showDestinationPoint,
    city,
    time,
    isDriver,
    showDetailInfo,
    type,
    status,
  } = props

  const cancelled = status === 'cancelled'

  return (
    <View style={[styles.container, style]} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
      <WaypointImage
        type={'firstPoint'}
        visible={showDeparturePoint}
        tintColor={
          cancelled
            ? colors.waypointImage.cancelled
            : type === 'tripsBooking' || isDriver
            ? colors.waypointImage.active
            : isVisited || type !== 'tripDetail'
            ? colors.waypointImage.visitedLine
            : colors.waypointImage.inactive
        }
        backgroundColor={
          cancelled
            ? colors.waypointImage.background
            : type === 'tripsBooking' || isDriver
            ? colors.waypointImage.active
            : !(showDetailInfo || isDriver)
            ? colors.waypointImage.background
            : isVisited
            ? colors.waypointImage.visitedLine
            : colors.waypointImage.inactive
        }
      />
      <WaypointImage
        type={
          !(isFirstVisited || isLastVisited) || showDestinationPoint || showDeparturePoint
            ? 'userSolidLine'
            : isFirstVisited
            ? 'userDepartureLine'
            : isLastVisited
            ? 'userDestinationLine'
            : null
        }
        visible={!isDriver && isVisited && type !== 'tripSearch'}
        shape={'line'}
        height={containerHeight}
        backgroundColor={'transparent'}
        tintColor={colors.waypointImage.visitedLine}
        lastPoint={showDestinationPoint}
      />
      <WaypointImage
        type={'lastPoint'}
        visible={showDestinationPoint}
        tintColor={
          cancelled
            ? colors.waypointImage.cancelled
            : type === 'tripsBooking' || isDriver
            ? colors.waypointImage.active
            : isVisited || type !== 'tripDetail'
            ? colors.waypointImage.visitedLine
            : colors.waypointImage.inactive
        }
        backgroundColor={
          cancelled
            ? colors.waypointImage.cancelled
            : type === 'tripsBooking' || isDriver
            ? colors.waypointImage.active
            : isVisited || type !== 'tripDetail'
            ? colors.waypointImage.visitedLine
            : colors.waypointImage.inactive
        }
      />
      <WaypointImage
        visible={!showDeparturePoint && !showDestinationPoint}
        backgroundColor={colors.waypointImage.background}
        tintColor={
          cancelled
            ? colors.waypointImage.cancelled
            : isDriver
            ? colors.waypointImage.inactive
            : isVisited
            ? colors.waypointImage.visitedLine
            : colors.waypointImage.inactive
        }
      />
      <View style={styles.cityContainerRow}>
        <View style={styles.cityContent}>
          <Text
            style={[
              isVisited || !showDetailInfo ? styles.cityActive : styles.city,
              {
                color: cancelled
                  ? colors.tripInfo.body.cityCancelled
                  : showDetailInfo && !isVisited
                  ? colors.tripInfo.body.city
                  : colors.tripInfo.body.cityVisited,
              },
            ]}
          >
            {city.main_text}
          </Text>
          {!!time && (
            <Text
              style={[
                styles.time,
                {
                  color: cancelled
                    ? colors.tripInfo.body.cityCancelled
                    : showDetailInfo
                    ? colors.tripInfo.body.city
                    : colors.tripInfo.body.time,
                },
              ]}
            >
              {time}
            </Text>
          )}
        </View>
        {!!address && showDetailInfo && (
          <Text
            style={[
              styles.address,
              {
                color: cancelled ? colors.tripInfo.body.addressCancelled : colors.tripInfo.body.address,
              },
            ]}
          >
            {address}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  cityContainerRow: {
    paddingLeft: 23,
  },
  cityContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  city: {
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  cityActive: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  time: {
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
  },
  address: {
    marginTop: 4,
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
})
