import { Dimensions } from 'react-native'
import DefaultColors from './DefaultTheme'
import LightTheme from './LightTheme'
import DarkTheme from './DarkTheme'

export type Themes = keyof typeof ThemesList

type ButtonTheme = {
  background: string
  text: string
  fetching: string
}

export type ButtonsType = {
  primary: ButtonTheme
  secondary: ButtonTheme
  disabled: ButtonTheme
  bordered: ButtonTheme
}

export type ThemeColors = typeof DefaultColors

export type CustomTheme = {
  dark: boolean
  name: string
  colors: ThemeColors
}

export const metrics = (() => {
  const { width, height } = Dimensions.get('screen')
  return {
    screenWidth: width < height ? width : height,
    screenHeight: width < height ? height : width,
  }
})()

export function isSmallScreen() {
  return metrics.screenWidth < 375
}

export function isSmallScreenIos() {
  return metrics.screenHeight < 750
}

export function marginBottom() {
  if (metrics.screenHeight < 700) return 50
  else if (metrics.screenHeight >= 700 && metrics.screenHeight < 800) return 75
  else if (metrics.screenHeight >= 800 && metrics.screenHeight <= 900) return 150
  return 250
}
export function marginBottomAndroid() {
  if (metrics.screenHeight < 700) return 150
  else if (metrics.screenHeight >= 700 && metrics.screenHeight < 800) return 200
  else if (metrics.screenHeight >= 800 && metrics.screenHeight <= 900) return 300
  return 350
}

export function combineTheme(customColors: ThemeColors) {
  const theme = { ...DefaultColors }
  Object.keys(customColors).forEach((key) => {
    theme[key] = combineColors(theme[key], customColors[key])
  })
  return theme
}

function combineColors(theme: any, color: any) {
  let result = { ...(theme || {}) }
  if (typeof color === 'object') {
    Object.keys(color).forEach((key) => {
      result[key] = combineColors(theme[key] || {}, color[key])
    })
  } else {
    result = color
  }
  return result
}

export const font = (
  weight?:
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 'thin'
    | 'extra-light'
    | 'light'
    | 'regular'
    | 'normal'
    | 'medium'
    | 'semi-bold'
    | 'bold'
    | 'extra-bold'
    | 'black'
): string => {
  switch (weight) {
    case 100:
    case 'thin':
      return 'Inter-Thin'
    case 200:
    case 'extra-light':
      return 'Inter-ExtraLight'
    case 300:
    case 'light':
      return 'Inter-Light'
    case 'medium':
    case 500:
      return 'Inter-Medium'
    case 600:
    case 'semi-bold':
      return 'Inter-SemiBold'
    case 700:
    case 'bold':
      return 'Inter-Bold'
    case 800:
    case 'extra-bold':
      return 'Inter-ExtraBold'
    case 900:
    case 'black':
      return 'Inter-Black'
    case 400:
    case 'normal':
    default:
      return 'Inter-Regular'
  }
}

const ThemesList = {
  light: LightTheme,
  dark: DarkTheme,
}

export default ThemesList
