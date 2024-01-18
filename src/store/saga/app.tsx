import { put, call, delay, select } from 'redux-saga/effects'
import { authSetTokenAction } from '../redux/auth'
import { countriesRequestAction, countryRequestAction } from '../redux/countries'
import * as Keychain from 'react-native-keychain'
import { CountryType, KeychainType, Nullable } from '../../types'
import I18n, { Localizations } from '../../localization'
import { AppState } from '..'
import SplashScreen from 'react-native-splash-screen'

const getCredentials = async (service: KeychainType) =>
  await Keychain.getGenericPassword({ service }).then((credentials) => (credentials ? credentials.password : ''))

const getLocale = (store: AppState): Localizations => store.app.locale
const getCurrentCountry = (store: AppState): Nullable<CountryType> => store.countries.country

export function* appStartSaga() {
  //temporally
  // SplashScreen.hide()
}

export function* appPersistedSaga() {
  I18n.locale = yield select(getLocale)
  yield put(countriesRequestAction())
  const current_country: Nullable<CountryType> = yield select(getCurrentCountry)
  if (current_country?.id) {
    yield put(countryRequestAction({ country_id: current_country.id }))
  }
  const token: Nullable<string> = yield call(getCredentials.bind(null, 'auth'))
  if (token) {
    yield put(authSetTokenAction({ token }))
  } else {
    //temporally
    // SplashScreen.hide()
  }
}
