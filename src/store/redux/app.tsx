import { Localizations } from '../../localization'
import { Themes } from '../../theme'
import { Action } from '../../types'

export interface AppState {
  locale: Localizations
  deviceTheme: boolean
  theme: Themes
}

export const APP_SET_THEME = 'APP_SET_THEME'
export const APP_SET_DEVICE_THEME = 'APP_SET_DEVICE_THEME'

export const appThemeAction = (params: Themes) => ({
  type: APP_SET_THEME,
  params,
})
export const appDeviceThemeAction = (params: boolean) => ({
  type: APP_SET_DEVICE_THEME,
  params,
})

export const initialState: AppState = {
  deviceTheme: true,
  theme: 'light',
  locale: 'ru',
}

const AppReducer = (state = initialState, action: Action<any>): AppState => {
  const { type, params } = action

  switch (type) {
    case APP_SET_THEME: {
      return { ...state, theme: params }
    }
    case APP_SET_DEVICE_THEME: {
      return { ...state, deviceTheme: params }
    }
    default:
      return state
  }
}

export default AppReducer
