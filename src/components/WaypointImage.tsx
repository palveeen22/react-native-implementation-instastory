import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet, ViewStyle, View } from 'react-native'
import { WaypointSolidLine, WaypointCircle, WaypointLine } from '../localization/images'

interface WaypointImageProps {
  height?: number
  shape?: 'circle' | 'line'
  type?: 'firstPoint' | 'middlePoint' | 'lastPoint' | 'userDepartureLine' | 'userDestinationLine' | 'userSolidLine'
  tintColor?: string
  backgroundColor?: string
  visible?: boolean
  zIndex?: number
  lastPoint?: boolean
  overflow?: 'visible' | 'hidden'
}

export default function (props: WaypointImageProps) {
  const { dark, colors } = useTheme()
  const {
    shape = 'circle',
    type = 'middlePoint',
    tintColor = colors.waypointImage.active,
    backgroundColor,
    height,
    visible = true,
    zIndex = 2,
    lastPoint,
    overflow = 'hidden',
  } = props
  if (!visible || (shape === 'line' && !height)) {
    return null
  }

  const size = 8

  const width = size
  let _height = height || size
  let _backgroundColor = backgroundColor || colors.waypointImage.background
  let _borderRadius = shape === 'circle' ? width / 2 : undefined
  let imgSource = WaypointCircle
  let _style: ViewStyle = { ...styles.container, overflow }

  switch (shape) {
    case 'line': {
      imgSource = WaypointLine
      _backgroundColor = 'transparent'
      switch (type) {
        case 'userDepartureLine': {
          imgSource = WaypointSolidLine
          _style = { ..._style, ...styles.depatrureLine }
          _height = _height / 2
          break
        }
        case 'userDestinationLine': {
          imgSource = WaypointSolidLine
          _style = { ..._style, ...styles.destinationLine }
          _height = _height / 2
          break
        }
        case 'userSolidLine': {
          imgSource = WaypointSolidLine
          _style = {
            ..._style,
            ...styles.solidLine,
            ...(lastPoint ? styles.lastPoint : {}),
          }
          break
        }
        case 'middlePoint': {
          _style = { ..._style, ...styles.mainLine }
          _height -= styles.lastPoint.bottom
        }

        default:
          _style = { ..._style, ...styles.lastPoint }
          break
      }
      break
    }
    case 'circle': {
      switch (type) {
        case 'firstPoint': {
          _style = { ..._style, ...styles.first }
          break
        }
        case 'lastPoint': {
          _style = { ..._style, ...styles.last, ...styles.lastPoint }
          break
        }
        default: {
          break
        }
      }
    }
    default: {
      break
    }
  }

  return (
    <View style={[_style, { width: size }]}>
      <View
        style={{
          height: _height,
          backgroundColor: _backgroundColor,
          borderRadius: _borderRadius,
        }}
      >
        <Image
          style={{ tintColor, width, height: _height, zIndex }}
          source={imgSource}
          resizeMethod={'resize'}
          resizeMode={shape === 'circle' ? 'contain' : type !== 'middlePoint' ? 'stretch' : 'repeat'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
  },
  first: {
    justifyContent: 'flex-start',
  },
  middleCentered: {
    justifyContent: 'center',
  },
  last: {
    justifyContent: 'flex-end',
  },
  mainLine: {
    justifyContent: 'flex-start',
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  depatrureLine: {
    justifyContent: 'flex-end',
  },
  destinationLine: {
    justifyContent: 'flex-start',
  },
  solidLine: {},
  lastPoint: {
    bottom: 4,
  },
})
