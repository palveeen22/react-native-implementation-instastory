import moment from 'moment'
import { put, call, select } from 'redux-saga/effects'
import { AppState } from '..'
import {
  Action,
  ApiErrorResponse,
  ApiResponse,
  ApiType,
  IntermediateCalculateCity,
  IntermediateCalculateSuccessResponse,
  IntermediateCityType,
  IntermediateTipsRequest,
  IntermediateTipsSuccessResponse,
  NewTripDetails,
  NewTripPublishRequest,
  NewTripPublishSuccessResponse,
  NewTripUpdateIntermediateRequest,
  PlaceRequest,
  PlaceSuccessResponse,
  RouteType,
  WaypointsType,
} from '../../types'
import {
  newTripGetIntermediateSuggestFailureAction,
  newTripGetIntermediateSuggestSuccessAction,
  newTripIntermediateTipsFailureAction,
  newTripIntermediateTipsSuccessAction,
  newTripPublishFailureAction,
  newTripPublishSuccessAction,
  newTripUpdateIntermediateFailureAction,
  newTripUpdateIntermediateSuccessAction,
} from '../redux/newTrip'
import { tripUpdateTimeRequestAction } from '../redux/trip'

const getIntermediateCities = (state: AppState): IntermediateCityType[] => state.newTrip.intermediate_cities
const getComfort = (state: AppState): NewTripDetails => state.newTrip.details

export function* editPriceTripRequestSaga(api: ApiType, action: Action<PlaceRequest>) {
  const response: ApiResponse<PlaceSuccessResponse> = yield call(api.updatePriceRequest, action.params)
  if (response.ok) {
    yield put(tripUpdateTimeRequestAction(response.data.result))
  } else {
    // yield put(newTripGetIntermediateSuggestFailureAction(response.data as ApiErrorResponse))
  }
}

export function* editDetailTripRequestSaga(api: ApiType, action: Action<PlaceRequest>) {
  const response: ApiResponse<PlaceSuccessResponse> = yield call(api.updateDetailRequest, action.params)
  if (response.ok) {
    yield put(tripUpdateTimeRequestAction(response.data.result))
  } else {
    // yield put(newTripGetIntermediateSuggestFailureAction(response.data as ApiErrorResponse))
  }
}

export function* editTimeTripRequestSaga(api: ApiType, action: Action<PlaceRequest>) {
  const response: ApiResponse<PlaceSuccessResponse> = yield call(api.updateTimeRequest, action.params)
  if (response.ok) {
    yield put(tripUpdateTimeRequestAction(response.data.result))
  } else {
    // yield put(newTripGetIntermediateSuggestFailureAction(response.data as ApiErrorResponse))
  }
}

export function* editRouteTripRequestSaga(api: ApiType, action: Action<PlaceRequest>) {
  const response: ApiResponse<PlaceSuccessResponse> = yield call(api.updateRouteRequest, action.params)
  if (response.ok) {
    yield put(tripUpdateTimeRequestAction(response.data.result))
  } else {
    // yield put(newTripGetIntermediateSuggestFailureAction(response.data as ApiErrorResponse))
  }
}

export function* newTripGetIntermediateSuggestRequestSaga(api: ApiType, action: Action<PlaceRequest>) {
  const response: ApiResponse<PlaceSuccessResponse> = yield call(api.getPlace, action.params)
  if (response.ok) {
    yield put(newTripGetIntermediateSuggestSuccessAction(response.data.result))
  } else {
    yield put(newTripGetIntermediateSuggestFailureAction(response.data as ApiErrorResponse))
  }
}

export function* newTripUpdateIntermediationRequestSaga(
  api: ApiType,
  action: Action<NewTripUpdateIntermediateRequest>
) {
  const points: IntermediateCalculateCity[] = action.params.cities.map((city) => ({
    id: city.place?.id || city.id,
    sessionToken: city.sessionToken,
  }))
  const response: ApiResponse<IntermediateCalculateSuccessResponse> = yield call(api.calcultateIntermediate, { points })
  if (response.ok) {
    const { cities } = action.params
    const { rides } = response.data.result
    const _cities = []
    for (let index = 0; index < cities.length; index++) {
      const city = { ...cities[index] }
      if (index === 0) {
        const utcOffset = rides[0].start_tz_offset
        city.utcOffset = utcOffset
        city.datetime = moment(city.datetime).add(-utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss+00:00')
      } else {
        const prev_datetime = _cities[index - 1].datetime
        const ride = rides[index - 1]
        const duration = ride.duration.value
        city.datetime = moment(prev_datetime).add(duration, 'seconds').utc().format('YYYY-MM-DDTHH:mm+00:00')
        city.waypoint = ride
        city.utcOffset = ride.end_tz_offset
      }
      _cities.push(city)
    }
    yield put(newTripUpdateIntermediateSuccessAction({ cities: _cities }))
  } else {
    yield put(newTripUpdateIntermediateFailureAction(response.data as ApiErrorResponse))
  }
}

export function* newTripPublishRequestSaga(api: ApiType, action: Action<NewTripPublishRequest>) {
  const intermediateCities: IntermediateCityType[] = yield select(getIntermediateCities)
  const waypoints: WaypointsType[] = intermediateCities.filter((city) => !!city.waypoint).map((city) => city.waypoint)
  const rides: RouteType[] = waypoints.map((waypoint, index) => ({
    start: {
      id: intermediateCities[index].id,
      description: intermediateCities[index].description,
      main_text: intermediateCities[index].main_text,
      secondary_text: intermediateCities[index].secondary_text,
      place: !intermediateCities[index].place
        ? null
        : {
          id: intermediateCities[index].place.id,
          description: intermediateCities[index].place.description,
          main_text: intermediateCities[index].place.main_text,
          secondary_text: intermediateCities[index].place.secondary_text,
        },
      datetime: intermediateCities[index].datetime,
      sessionToken: intermediateCities[index].sessionToken,
      tz_offset: undefined,
    },
    end: {
      id: intermediateCities[index + 1].id,
      description: intermediateCities[index + 1].description,
      main_text: intermediateCities[index + 1].main_text,
      secondary_text: intermediateCities[index + 1].secondary_text,
      place: !intermediateCities[index + 1].place
        ? null
        : {
          id: intermediateCities[index + 1].place.id,
          description: intermediateCities[index + 1].place.description,
          main_text: intermediateCities[index + 1].place.main_text,
          secondary_text: intermediateCities[index + 1].place.secondary_text,
        },
      datetime: intermediateCities[index + 1].datetime,
      sessionToken: intermediateCities[index + 1].sessionToken,
      tz_offset: undefined,
    },
    price: waypoint.price,
    passengers: undefined,
  }))

  const tripDetail: NewTripDetails = yield select(getComfort)
  const car_id = tripDetail.car.id
  const cargo = tripDetail.cargo
  const take_delivery = tripDetail.take_delivery
  const max2seat = tripDetail.max2seat
  const animals = tripDetail.animals
  const baby_chair = tripDetail.baby_chair
  const can_smoke = tripDetail.can_smoke
  const passenger_payment = tripDetail.passenger_payment
  const passengers = tripDetail.passengers
  const confirm_booking = tripDetail.confirm_booking
  const comment = tripDetail.comment

  const params: NewTripPublishRequest = {
    car_id,
    cargo,
    take_delivery,
    max2seat,
    animals,
    baby_chair,
    can_smoke,
    passenger_payment,
    passengers,
    confirm_booking,
    comment,
    rides,
  }

  const response: ApiResponse<NewTripPublishSuccessResponse> = yield call(api.publishTrip, params)
  if (response.ok) {
    yield put(newTripPublishSuccessAction(response.data.result))
  } else {
    yield put(newTripPublishFailureAction(response.data as ApiErrorResponse))
  }
}

export function* newTripIntermediateTipsAction(api: ApiType, action: Action<IntermediateTipsRequest>) {
  const response: ApiResponse<IntermediateTipsSuccessResponse> = yield call(api.intermediateTipsRequest, action.params)
  if (response.ok === true) {
    yield put(newTripIntermediateTipsSuccessAction(response.data.result))
  } else {
    yield put(newTripIntermediateTipsFailureAction(response.data))
  }
}
