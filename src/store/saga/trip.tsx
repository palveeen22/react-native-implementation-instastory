import { put, call, delay, select } from 'redux-saga/effects'
import {
  Action,
  ApiType,
  TripDetailRequest,
  TripDetailResponse,
  TripsRequest,
  TripsSuccessResponse,
  ApiResponse,
  ApiErrorResponse,
  TripsSearchResponse,
  TripSearchRequest,
  TripCancelBookingRequest,
  TripCancelBookingSuccessResponse,
  TripBookingRequest,
  TripBookingSuccessResponse,
  TripCancelRequest,
  TripCancelSuccessResponse,
  TripInfoType,
  Nullable,
  TripSearch,
  TripSearchFiltersUpdateRequest,
  TripSearchFiltersUpdateSuccessResponse,
} from '../../types'
import {
  tripDetailFailureAction,
  tripDetailSuccessAction,
  tripsBookedSuccessAction,
  tripsBookedFailureAction,
  tripsPublishedSuccessAction,
  tripsPublishedFailureAction,
  tripSearchFailureAction,
  tripSearchSuccessAction,
  tripCancelBookingSuccessAction,
  tripCancelBookingFailureAction,
  tripBookingSuccessAction,
  tripBookingFailureAction,
  tripCancelSuccessAction,
  tripCancelFailureAction,
  tripDetailRequestAction,
  tripSearchUpdateFiltersSuccessAction,
  tripSearchUpdateFiltersFailureAction,
  tripsPublishedArchiveSuccessAction,
  tripsPublishedFailureArchiveAction,
  tripsBookedArchiveSuccessAction,
  tripsBookedArchiveFailureAction,
  tripFinishSuccessAction,
  tripFinishFailureAction,
} from '../redux/trip'
import { AppState } from '..'

const getPublished = (store: AppState): Nullable<TripInfoType[]> => store.trip.published
const getBooked = (store: AppState): Nullable<TripInfoType[]> => store.trip.booked
const getSearch = (store: AppState): Nullable<TripInfoType[]> => store.trip.search_response

export function* tripPublishedRequestSaga(api: ApiType, action: Action<TripsRequest>) {
  const response: ApiResponse<TripsSuccessResponse> = yield call(api.getTrips, action.params)
  if (response.ok) {
    yield put(tripsPublishedSuccessAction(response.data.result))
  } else {
    yield put(tripsPublishedFailureAction(response.data as ApiErrorResponse))
  }
}
export function* tripBookedRequestSaga(api: ApiType, action: Action<TripsRequest>) {
  const response: ApiResponse<TripsSuccessResponse> = yield call(api.getTrips, action.params)
  if (response.ok) {
    yield put(tripsBookedSuccessAction(response.data.result))
  } else {
    yield put(tripsBookedFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripPublishedArchiveRequestSaga(api: ApiType, action: Action<TripsRequest>) {
  const response: ApiResponse<TripsSuccessResponse> = yield call(api.getTripsArchive, action.params)
  if (response.ok) {
    yield put(tripsPublishedArchiveSuccessAction(response.data.result))
  } else {
    yield put(tripsPublishedFailureArchiveAction(response.data as ApiErrorResponse))
  }
}

export function* tripBookedArchiveRequestSaga(api: ApiType, action: Action<TripsRequest>) {
  const response: ApiResponse<TripsSuccessResponse> = yield call(api.getTripsArchive, action.params)
  if (response.ok) {
    yield put(tripsBookedArchiveSuccessAction(response.data.result))
  } else {
    yield put(tripsBookedArchiveFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripDetailRequestSaga(api: ApiType, action: Action<TripDetailRequest>) {
  const published = yield select(getPublished)
  const booked = yield select(getBooked)
  const search = yield select(getSearch)
  const rides: TripInfoType[] = [...(published || []), ...(booked || []), ...(search || [])]
  const ride = rides.find((ride) => ride.id === action.params.id)
  yield delay(100)
  yield put(tripDetailSuccessAction({ ride }))
  // const response: ApiResponse<TripDetailResponse> = yield call(api.getRideDetail, action.params)
  // if (response.ok) {
  // yield put(tripDetailSuccessAction(response.data.result))
  // } else {
  // yield put(tripDetailFailureAction(response.data as ApiErrorResponse))
  // }
}

export function* tripSearchRequestSaga(api: ApiType, action: Action<TripSearch>) {
  const response: ApiResponse<TripsSearchResponse> = yield call(api.searchTrips, action.params)
  if (response.ok) {
    yield put(tripSearchSuccessAction(response.data.result))
  } else {
    yield put(tripSearchFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripSearchFiltersRequestSaga(api: ApiType, action: Action<TripSearchFiltersUpdateRequest>) {
  const response: ApiResponse<TripSearchFiltersUpdateSuccessResponse> = yield call(api.searchTripsFilter, action.params)
  if (response.ok) {
    yield put(tripSearchUpdateFiltersSuccessAction(response.data.result))
  } else {
    yield put(tripSearchUpdateFiltersFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripCancelBookingSaga(api: ApiType, action: Action<TripCancelBookingRequest>) {
  const response: ApiResponse<TripCancelBookingSuccessResponse> = yield call(api.cancelBooking, action.params)
  if (response.ok) {
    const booked: Nullable<TripInfoType[]> = yield select(getBooked)
    const rides = booked?.filter((trip) => trip.id !== action.params.ride_id) || null
    yield put(tripCancelBookingSuccessAction({ rides }))
  } else {
    yield put(tripCancelBookingFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripBookingSaga(api: ApiType, action: Action<TripBookingRequest>) {
  const response: ApiResponse<TripBookingSuccessResponse> = yield call(api.bookingTrip, action.params)
  if (response.ok) {
    yield put(tripBookingSuccessAction(response.data.result))
  } else {
    yield put(tripBookingFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripCancelSaga(api: ApiType, action: Action<TripCancelRequest>) {
  const response: ApiResponse<TripCancelSuccessResponse> = yield call(api.cancelTrip, action.params)
  if (response.ok) {
    const rides: TripInfoType[] = yield select(getPublished)
    const _rides = [...rides]
    const index = _rides?.findIndex((trip) => trip.id === action.params.ride_id)
    if (index != -1) {
      _rides[index].status = 'cancelled'
    }
    yield put(tripDetailRequestAction({ id: action.params.ride_id }))
    yield put(tripCancelSuccessAction({ rides: _rides }))
  } else {
    yield put(tripCancelFailureAction(response.data as ApiErrorResponse))
  }
}

export function* tripFinishSaga(api: ApiType, action: Action<TripCancelRequest>) {
  const response: ApiResponse<TripCancelSuccessResponse> = yield call(api.finishTrip, action.params)
  if (response.ok) {
    const rides: TripInfoType[] = yield select(getPublished)
    const _rides = [...rides]
    const index = _rides?.findIndex((trip) => trip.id === action.params.ride_id)
    if (index != -1) {
      _rides[index].status = 'finished'
    }
    yield put(tripDetailRequestAction({ id: action.params.ride_id }))
    yield put(tripFinishSuccessAction({ rides: _rides }))
  } else {
    yield put(tripFinishFailureAction(response.data as ApiErrorResponse))
  }
}
