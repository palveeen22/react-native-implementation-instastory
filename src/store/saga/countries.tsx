import { put, call, delay, select } from 'redux-saga/effects'
import {
  Action,
  AgreementType,
  ApiErrorResponse,
  ApiResponse,
  ApiType,
  CountriesRequest,
  CountriesSuccessResponse,
  CountryRequest,
  CountrySuccessResponse,
} from '../../types'
import {
  countriesFailureAction,
  countriesSuccessAction,
  countryFailureAction,
  countrySuccessAction,
} from '../redux/countries'

export function* countriesRequestSaga(api: ApiType, action: Action<CountriesRequest>) {
  const response: ApiResponse<CountriesSuccessResponse> = yield call(api.getCountries, action.params)
  if (response.ok) {
    yield put(countriesSuccessAction(response.data.result))
  } else {
    yield put(countriesFailureAction(response.data as ApiErrorResponse))
  }
}

export function* countryRequestSaga(api: ApiType, action: Action<CountryRequest>) {
  const response: ApiResponse<CountrySuccessResponse> = yield call(api.getCountry, action.params)
  if (response.ok) {
    yield put(countrySuccessAction(response.data.result))
  } else {
    yield put(countryFailureAction(response.data as ApiErrorResponse))
  }
}
