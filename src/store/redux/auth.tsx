import { Nullable, AuthSuccessResponse, Action, AuthRequest, ApiErrorResponse, AuthRequestGoogle, AuthRequestTelegram, AuthRequestApple, AuthRequestYandex } from '../../types'
import * as Keychain from 'react-native-keychain'

export interface AuthState {
  token: Nullable<string>
  verified: boolean
  token_google: Nullable<string>
  fetching: boolean
  phone: Nullable<string>
  error: ApiErrorResponse
}

export const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN'
export const AUTH_SET_TOKEN_GOOGLE_CHECK = 'AUTH_SET_TOKEN_GOOGLE_CHECK'
export const AUTH_SET_TOKEN_APPLE_CHECK = 'AUTH_SET_TOKEN_APPLE_CHECK'
export const AUTH_SET_TOKEN_GOOGLE = 'AUTH_SET_TOKEN_GOOGLE'
export const AUTH_SET_TOKEN_APPLE = 'AUTH_SET_TOKEN_APPLE'
export const AUTH_SET_TOKEN_YANDEX = 'AUTH_SET_TOKEN_YANDEX'
export const AUTH_SET_TOKEN_TELEGRAM = 'AUTH_SET_TOKEN_TELEGRAM'
export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_REQUEST_GOOGLE_CHECK = 'AUTH_REQUEST_GOOGLE_CHECK'
export const AUTH_REQUEST_APPLE_CHECK = 'AUTH_REQUEST_APPLE_CHECK'
export const AUTH_REQUEST_GOOGLE = 'AUTH_REQUEST_GOOGLE'
export const AUTH_REQUEST_APPLE = 'AUTH_REQUEST_APPLE'
export const AUTH_REQUEST_YANDEX = 'AUTH_REQUEST_YANDEX'
export const AUTH_REQUEST_TELEGRAM = 'AUTH_REQUEST_TELEGRAM'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_FAILURE = 'AUTH_FAILURE'
export const AUTH_LOGOUT_REQUEST = 'AUTH_LOGOUT_REQUEST'
export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS'
export const AUTH_LOGOUT_FAILURE = 'AUTH_LOGOUT_FAILURE'

export const authSetTokenAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN,
  payload,
})

export const authSetTokenGoogleCheckAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN_GOOGLE_CHECK,
  payload,
})

export const authSetTokenAppleCheckAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN_APPLE_CHECK,
  payload,
})

export const authSetTokenGoogleAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN_GOOGLE,
  payload,
})
export const authSetTokenAppleAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN_APPLE,
  payload,
})
export const authSetTokenYandexAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN_YANDEX,
  payload,
})
export const authSetTokenTelegramAction = (payload: AuthSuccessResponse) => ({
  type: AUTH_SET_TOKEN_TELEGRAM,
  payload,
})
export const authRequestAction = (params: AuthRequest) => ({
  type: AUTH_REQUEST,
  params,
})
export const authRequestGoogleCheckAction = (params: AuthRequest) => ({
  type: AUTH_REQUEST_GOOGLE_CHECK,
  params,
})
export const authRequestAppleCheckAction = (params: AuthRequest) => ({
  type: AUTH_REQUEST_APPLE_CHECK,
  params,
})
export const authRequestGoogleAction = (params: AuthRequestGoogle) => ({
  type: AUTH_REQUEST_GOOGLE,
  params,
})
export const authRequestAppleAction = (params: AuthRequestApple) => ({
  type: AUTH_REQUEST_APPLE,
  params,
})
export const authRequestYandexAction = (params: AuthRequestYandex) => ({
  type: AUTH_REQUEST_YANDEX,
  params,
})
export const authRequestTelegramAction = (params: AuthRequestTelegram) => ({
  type: AUTH_REQUEST_TELEGRAM,
  params,
})
export const authSuccessAction = () => ({ type: AUTH_SUCCESS })
export const authFailureAction = (payload: ApiErrorResponse) => ({
  type: AUTH_FAILURE,
  payload,
})
export const authLogoutRequestAction = (params: string) => ({
  type: AUTH_LOGOUT_REQUEST,
  params,
})
export const authLogoutSuccessAction = () => ({ type: AUTH_LOGOUT_SUCCESS })
export const authLogoutFailureAction = (payload: ApiErrorResponse) => ({
  type: AUTH_LOGOUT_FAILURE,
  payload,
})

export const initialState: AuthState = {
  token: null,
  token_google: null,
  fetching: false,
  phone: null,
  error: null,
  verified: null,
}

const AuthReducer = (state = initialState, action: Action<any>): AuthState => {
  const { type, payload, params } = action
  switch (type) {
    case AUTH_SET_TOKEN_APPLE: {
      const { token } = payload as AuthSuccessResponse
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        phone: null,
      }
    }
    case AUTH_SET_TOKEN_YANDEX: {
      const { token } = payload as AuthSuccessResponse
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        phone: null,
      }
    }
    case AUTH_SET_TOKEN_GOOGLE: {
      const { token } = payload as AuthSuccessResponse
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      Keychain.setGenericPassword('token_google', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        token_google: token,
        phone: null,
      }
    }
    case AUTH_SET_TOKEN_TELEGRAM: {
      const { token } = payload as AuthSuccessResponse
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        phone: null,
      }
    }
    case AUTH_SET_TOKEN: {
      const { token } = payload as AuthSuccessResponse
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        phone: null,
      }
    }
    case AUTH_SET_TOKEN_APPLE_CHECK: {
      const { token } = payload as AuthSuccessResponse
      //here
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        phone: null,
        verified: true,
      }
    }
    case AUTH_SET_TOKEN_GOOGLE_CHECK: {
      const { token } = payload as AuthSuccessResponse
      //here
      Keychain.setGenericPassword('token', token, { service: 'auth' })
      return {
        ...state,
        fetching: false,
        token,
        token_google: token,
        phone: null,
        verified: true,
      }
    }
    case AUTH_REQUEST: {
      const { phone } = action.params as AuthRequest
      return { ...state, error: null, fetching: true, phone }
    }
    case AUTH_REQUEST_GOOGLE_CHECK: {
      // const { phone } = action.params as AuthRequest
      // return { ...state, error: null, fetching: true, phone }
      const { phone } = action.params as AuthRequest
      return { ...state, error: null, fetching: true }
    }
    case AUTH_REQUEST_APPLE_CHECK: {
      // const { phone } = action.params as AuthRequest
      // return { ...state, error: null, fetching: true, phone }
      const { phone } = action.params as AuthRequest
      return { ...state, error: null, fetching: true }
    }
    case AUTH_REQUEST_TELEGRAM: {
      const { phone } = action.params as AuthRequestTelegram
      return { ...state, error: null, fetching: true, phone }
    }
    case AUTH_LOGOUT_REQUEST: {
      return { ...state, error: null, fetching: true }
    }
    case AUTH_SUCCESS: {
      return { ...state, fetching: false, verified: true }
    }
    case AUTH_FAILURE:
    case AUTH_LOGOUT_FAILURE: {
      const { error } = payload
      return { ...state, fetching: false, error }
    }
    case AUTH_LOGOUT_SUCCESS: {
      Keychain.resetGenericPassword({ service: 'auth' })
      return initialState
    }
    default:
      return state
  }
}

export default AuthReducer
