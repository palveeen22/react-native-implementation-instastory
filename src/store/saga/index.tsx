import { takeLatest, all, put, delay } from 'redux-saga/effects'
import { APP_STARTED, APP_PERSISTED } from '../redux/_app'
import { appPersistedAction } from '../redux/_app'
import { appStartSaga, appPersistedSaga } from './app'
import {
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_REQUEST,
  AUTH_REQUEST_APPLE,
  AUTH_REQUEST_APPLE_CHECK,
  AUTH_REQUEST_GOOGLE,
  AUTH_REQUEST_GOOGLE_CHECK,
  AUTH_REQUEST_TELEGRAM,
  AUTH_REQUEST_YANDEX,
  AUTH_SET_TOKEN,
  AUTH_SET_TOKEN_APPLE,
  AUTH_SET_TOKEN_APPLE_CHECK,
  AUTH_SET_TOKEN_GOOGLE,
  AUTH_SET_TOKEN_GOOGLE_CHECK,
  AUTH_SET_TOKEN_TELEGRAM,
  AUTH_SET_TOKEN_YANDEX,
  authSetTokenAppleCheckAction,
} from '../redux/auth'
import {
  authLogoutSaga,
  authRequestSaga,
  authSetTokenSaga,
  authLogoutSuccessSaga,
  authRequestGoogleSaga,
  authSetTokenGoogleSaga,
  authRequestTelegramSaga,
  authSetTokenTelegramSaga,
  authRequestGoogleCheckSaga,
  authSetTokenGoogleCheckSaga,
  authRequestAppleSaga,
  authRequestAppleCheckSaga,
  authSetTokenAppleCheckSaga,
  authRequestYandexSaga,
} from './auth'
import { NOTIFICATIONS_READ_REQUEST, NOTIFICATIONS_REQUEST } from '../redux/notifications'
import { notificationsReadRequestSaga, notificationsRequestSaga } from './notifications'
import { USER_PROFILE_APPLE_REQUEST, USER_PROFILE_DELETE_REQUEST, USER_PROFILE_GOOGLE_REQUEST, USER_PROFILE_REQUEST, USER_PROFILE_UPDATE_REQUEST, USER_STORIES } from '../redux/user'
import { userDeleteRequestSaga, userRequestAppleSaga, userRequestGoogleSaga, userRequestSaga, userStoriesRequestSaga, userUpdateRequestSaga } from './user'
import API from '../../api'
import config from '../../config'
import FixtureApi from '../../fixtures'
import {
  TRIP_DETAIL_REQUEST,
  TRIP_PUBLISHED_REQUEST,
  TRIP_BOOKED_REQUEST,
  TRIP_SEARCH_REQUEST,
  TRIP_CANCEL_BOOKING_REQUEST,
  TRIP_BOOKING_REQUEST,
  TRIP_CANCEL_REQUEST,
  TRIP_SEARCH_UPDATE_FILTER_REQUEST,
  TRIP_PUBLISHED_ARCHIVE_REQUEST,
  TRIP_BOOKED_ARCHIVE_REQUEST,
  TRIP_FINISH_REQUEST,
} from '../redux/trip'
import {
  tripDetailRequestSaga,
  tripPublishedRequestSaga,
  tripBookedRequestSaga,
  tripSearchRequestSaga,
  tripCancelBookingSaga,
  tripBookingSaga,
  tripCancelSaga,
  tripSearchFiltersRequestSaga,
  tripPublishedArchiveRequestSaga,
  tripBookedArchiveRequestSaga,
  tripFinishSaga,
} from './trip'
import {
  CARS_ADD_CAR_REQUEST,
  CARS_COLORS_REQUEST,
  CARS_DELETE_CAR_REQUEST,
  CARS_REQUEST,
  CARS_UPDATE_CAR_REQUEST,
} from '../redux/cars'
import {
  carsAddCarRequestSaga,
  carsColorsRequestSaga,
  carsDeleteRequestSaga,
  carsRequestSaga,
  carsUpdateCarRequestSaga,
} from './cars'
import {
  EDIT_TRIP_DETAIL_REQUEST,
  EDIT_TRIP_PRICE_REQUEST,
  EDIT_TRIP_ROUTE_REQUEST,
  EDIT_TRIP_TIME_REQUEST,
  NEWTRIP_GET_INTERMEDIATE_SUGGEST_REQUEST,
  NEWTRIP_INTERMEDIATE_TIPS_REQUEST_ACTION,
  NEWTRIP_PUBLISH_REQUEST,
  NEWTRIP_UPDATE_INTERMEDIATE_REQUEST,
} from '../redux/newTrip'
import {
  editDetailTripRequestSaga,
  editPriceTripRequestSaga,
  editRouteTripRequestSaga,
  editTimeTripRequestSaga,
  newTripGetIntermediateSuggestRequestSaga,
  newTripIntermediateTipsAction,
  newTripPublishRequestSaga,
  newTripUpdateIntermediationRequestSaga,
} from './newTrip'
import { COUNTRIES_REQUEST, COUNTRIES_COUNTRY_REQUEST } from '../redux/countries'
import { countriesRequestSaga, countryRequestSaga } from './countries'

export const api = API.create() //config.api.useFixture ? FixtureApi : API.create();

function* watchIncrementAsync() {
  yield takeLatest('persist/REHYDRATE', onRegidrate)
  yield takeLatest(APP_STARTED, appStartSaga)
  yield takeLatest(APP_PERSISTED, appPersistedSaga)
  yield takeLatest(AUTH_REQUEST, authRequestSaga, api)
  yield takeLatest(AUTH_REQUEST_GOOGLE, authRequestGoogleSaga, api)
  yield takeLatest(AUTH_REQUEST_APPLE, authRequestAppleSaga, api)
  yield takeLatest(AUTH_REQUEST_YANDEX, authRequestYandexSaga, api)
  yield takeLatest(AUTH_REQUEST_GOOGLE_CHECK, authRequestGoogleCheckSaga, api)
  yield takeLatest(AUTH_REQUEST_APPLE_CHECK, authRequestAppleCheckSaga, api)
  // yield takeLatest(AUTH_REQUEST_TELEGRAM, authRequestTelegramSaga, api)
  yield takeLatest(AUTH_SET_TOKEN, authSetTokenSaga, api)
  yield takeLatest(AUTH_SET_TOKEN_GOOGLE_CHECK, authSetTokenGoogleCheckSaga, api)
  yield takeLatest(AUTH_SET_TOKEN_APPLE_CHECK, authSetTokenAppleCheckSaga, api)
  yield takeLatest(AUTH_SET_TOKEN_GOOGLE, authSetTokenGoogleSaga, api) //
  yield takeLatest(AUTH_SET_TOKEN_APPLE, authSetTokenGoogleSaga, api) //
  yield takeLatest(AUTH_SET_TOKEN_YANDEX, authSetTokenGoogleSaga, api) //
  yield takeLatest(AUTH_SET_TOKEN_TELEGRAM, authSetTokenTelegramSaga, api)
  yield takeLatest(AUTH_LOGOUT_REQUEST, authLogoutSaga, api)
  yield takeLatest(AUTH_LOGOUT_SUCCESS, authLogoutSuccessSaga)
  yield takeLatest(USER_PROFILE_REQUEST, userRequestSaga, api)
  yield takeLatest(USER_STORIES, userStoriesRequestSaga, api)
  yield takeLatest(USER_PROFILE_GOOGLE_REQUEST, userRequestGoogleSaga, api)
  yield takeLatest(USER_PROFILE_APPLE_REQUEST, userRequestAppleSaga, api)
  yield takeLatest(USER_PROFILE_DELETE_REQUEST, userDeleteRequestSaga, api)
  yield takeLatest(NOTIFICATIONS_REQUEST, notificationsRequestSaga, api)
  yield takeLatest(NOTIFICATIONS_READ_REQUEST, notificationsReadRequestSaga, api)
  yield takeLatest(USER_PROFILE_UPDATE_REQUEST, userUpdateRequestSaga, api)
  yield takeLatest(TRIP_PUBLISHED_REQUEST, tripPublishedRequestSaga, api)
  yield takeLatest(TRIP_PUBLISHED_ARCHIVE_REQUEST, tripPublishedArchiveRequestSaga, api)
  yield takeLatest(TRIP_BOOKED_REQUEST, tripBookedRequestSaga, api)
  yield takeLatest(TRIP_BOOKED_ARCHIVE_REQUEST, tripBookedArchiveRequestSaga, api)
  yield takeLatest(TRIP_DETAIL_REQUEST, tripDetailRequestSaga, api)
  yield takeLatest(TRIP_SEARCH_REQUEST, tripSearchRequestSaga, api)
  yield takeLatest(TRIP_CANCEL_BOOKING_REQUEST, tripCancelBookingSaga, api)
  yield takeLatest(TRIP_CANCEL_REQUEST, tripCancelSaga, api)
  yield takeLatest(TRIP_FINISH_REQUEST, tripFinishSaga, api)
  yield takeLatest(TRIP_BOOKING_REQUEST, tripBookingSaga, api)
  yield takeLatest(CARS_REQUEST, carsRequestSaga, api)
  yield takeLatest(CARS_COLORS_REQUEST, carsColorsRequestSaga, api)
  yield takeLatest(CARS_ADD_CAR_REQUEST, carsAddCarRequestSaga, api)
  yield takeLatest(CARS_UPDATE_CAR_REQUEST, carsUpdateCarRequestSaga, api)
  yield takeLatest(CARS_DELETE_CAR_REQUEST, carsDeleteRequestSaga, api)
  yield takeLatest(NEWTRIP_GET_INTERMEDIATE_SUGGEST_REQUEST, newTripGetIntermediateSuggestRequestSaga, api)

  yield takeLatest(EDIT_TRIP_PRICE_REQUEST, editPriceTripRequestSaga, api)
  yield takeLatest(EDIT_TRIP_DETAIL_REQUEST, editDetailTripRequestSaga, api)
  yield takeLatest(EDIT_TRIP_TIME_REQUEST, editTimeTripRequestSaga, api)
  yield takeLatest(EDIT_TRIP_ROUTE_REQUEST, editRouteTripRequestSaga, api)

  yield takeLatest(NEWTRIP_UPDATE_INTERMEDIATE_REQUEST, newTripUpdateIntermediationRequestSaga, api)
  yield takeLatest(NEWTRIP_PUBLISH_REQUEST, newTripPublishRequestSaga, api)
  yield takeLatest(COUNTRIES_REQUEST, countriesRequestSaga, api)
  yield takeLatest(COUNTRIES_COUNTRY_REQUEST, countryRequestSaga, api)
  yield takeLatest(NEWTRIP_INTERMEDIATE_TIPS_REQUEST_ACTION, newTripIntermediateTipsAction, api)
  yield takeLatest(TRIP_SEARCH_UPDATE_FILTER_REQUEST, tripSearchFiltersRequestSaga, api)
}

function* onRegidrate() {
  yield put(appPersistedAction())
}

export default function* init() {
  yield all([watchIncrementAsync()])
}
