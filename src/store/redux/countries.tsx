import {
  ApiFailure,
  ApiErrorResponse,
  CountriesSuccessResponse,
  CountryType,
  Nullable,
  CountryRequest,
  CountryExtendedType,
  CountrySuccessResponse,
} from '../../types'
import { AUTH_LOGOUT_SUCCESS } from './auth'

export interface CountriesState {
  countries: Nullable<CountryType[]>
  fetching: boolean
  error: Nullable<ApiFailure>
  country: Nullable<CountryExtendedType>
  country_fetching: boolean
  country_error: Nullable<ApiFailure>
}

export const COUNTRIES_REQUEST = 'COUNTRIES_REQUEST'
export const COUNTRIES_SUCCESS = 'COUNTRIES_SUCCESS'
export const COUNTRIES_FAILURE = 'COUNTRIES_FAILURE'

export const COUNTRIES_COUNTRY_REQUEST = 'COUNTRIES_COUNTRY_REQUEST'
export const COUNTRIES_COUNTRY_SUCCESS = 'COUNTRIES_COUNTRY_SUCCESS'
export const COUNTRIES_COUNTRY_FAILURE = 'COUNTRIES_COUNTRY_FAILURE'

export const countriesRequestAction = () => ({ type: COUNTRIES_REQUEST })
export const countriesSuccessAction = (payload: CountriesSuccessResponse) => ({
  type: COUNTRIES_SUCCESS,
  payload,
})
export const countriesFailureAction = (payload: ApiErrorResponse) => ({
  type: COUNTRIES_FAILURE,
  payload,
})

export const countryRequestAction = (params: CountryRequest) => ({
  type: COUNTRIES_COUNTRY_REQUEST,
  params,
})
export const countrySuccessAction = (payload) => ({
  type: COUNTRIES_COUNTRY_SUCCESS,
  payload,
})
export const countryFailureAction = (payload) => ({
  type: COUNTRIES_COUNTRY_FAILURE,
  payload,
})

export const initialState: CountriesState = {
  countries: null,
  fetching: false,
  error: null,
  country: null,
  country_fetching: false,
  country_error: null,
}

const CountriesReducer = (state = initialState, action: any): CountriesState => {
  const { type, payload, params } = action
  switch (type) {
    case COUNTRIES_REQUEST: {
      return { ...state, error: null, fetching: true }
    }
    case COUNTRIES_SUCCESS: {
      const { countries } = payload as CountriesSuccessResponse
      return { ...state, fetching: false, countries }
    }
    case COUNTRIES_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, fetching: false, error }
    }
    case COUNTRIES_COUNTRY_REQUEST: {
      return { ...state, country_error: null, country_fetching: true }
    }
    case COUNTRIES_COUNTRY_SUCCESS: {
      const { country } = payload as CountrySuccessResponse
      return { ...state, country_fetching: false, country }
    }
    case COUNTRIES_COUNTRY_FAILURE: {
      const { error: country_error } = payload as ApiErrorResponse
      return { ...state, country_fetching: false, country_error }
    }
    case AUTH_LOGOUT_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}

export default CountriesReducer
