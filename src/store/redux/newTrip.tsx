import { ApiErrorResponse } from '../../api'
import {
  ApiFailure,
  Nullable,
  CitySuggestType,
  NewTripUpdateIntermediateRequest,
  NewTripUpdateIntermediateSuccessResponse,
  PlaceRequest,
  PlaceSuccessResponse,
  IntermediateCityType,
  NewTripDetails,
  TripPriceUpdateRequest,
  NewTripPublishSuccessResponse,
  IntermediateTipsRequest,
  IntermediateTipsSuccessResponse,
  Action,
  TripDetailRequest,
  TripDetailUpdateRequest,
  TripTimeUpdateRequest,
} from '../../types'

export interface NewTripState {
  intermediate_cities: Nullable<IntermediateCityType[]>
  intermediate_cities_fetching: boolean
  intermediate_cities_error: Nullable<ApiFailure>
  intermadiate_suggests: Nullable<CitySuggestType[]>
  intermadiate_suggests_error: Nullable<ApiFailure>
  details: Nullable<NewTripDetails>
  publish_trip_fetching: boolean
  publish_trip_error: Nullable<ApiFailure>
  intermediate_tips: Nullable<CitySuggestType[]>
  intermediate_tips_fetching: boolean
  intermediate_tips_error: Nullable<ApiFailure>
}

export const NEWTRIP_UPDATE_INTERMEDIATE_REQUEST = 'NEWTRIP_UPDATE_INTERMEDIATE_REQUEST'
export const NEWTRIP_UPDATE_INTERMEDIATE_SUCCESS = 'NEWTRIP_UPDATE_INTERMEDIATE_SUCCESS'
export const NEWTRIP_UPDATE_INTERMEDIATE_FAILURE = 'NEWTRIP_UPDATE_INTERMEDIATE_FAILURE'

export const NEWTRIP_GET_INTERMEDIATE_SUGGEST_REQUEST = 'NEWTRIP_GET_INTERMEDIATE_SUGGEST_REQUEST'
export const NEWTRIP_GET_INTERMEDIATE_SUGGEST_SUCCESS = 'NEWTRIP_GET_INTERMEDIATE_SUGGEST_SUCCESS'
export const NEWTRIP_GET_INTERMEDIATE_SUGGEST_FAILURE = 'NEWTRIP_GET_INTERMEDIATE_SUGGEST_FAILURE'

export const NEWTRIP_UPDATE_INTERMEDIATE_PRICE = 'NEWTRIP_UPDATE_INTERMEDIATE_PRICE'

export const NEWTRIP_SET_DETAILS = 'NEWTRIP_SET_DETAILS'

export const NEWTRIP_PUBLISH_REQUEST = 'NEWTRIP_PUBLISH_REQUEST'
export const NEWTRIP_PUBLISH_SUCCESS = 'NEWTRIP_PUBLISH_SUCCESS'
export const NEWTRIP_PUBLISH_FAILURE = 'NEWTRIP_PUBLISH_FAILURE'

export const EDIT_TRIP_PRICE_REQUEST = 'EDIT_TRIP_PRICE_REQUEST'
export const EDIT_TRIP_DETAIL_REQUEST = 'EDIT_TRIP_DETAIL_REQUEST'
export const EDIT_TRIP_TIME_REQUEST = 'EDIT_TRIP_TIME_REQUEST'
export const EDIT_TRIP_ROUTE_REQUEST = 'EDIT_TRIP_ROUTE_REQUEST'

export const NEWTRIP_INTERMEDIATE_TIPS_REQUEST_ACTION = 'NEWTRIP_INTERMEDIATE_TIPS_REQUEST_ACTION'
export const NEWTRIP_INTERMEDIATE_TIPS_SUCCESS_ACTION = 'NEWTRIP_INTERMEDIATE_TIPS_SUCCESS_ACTION'
export const NEWTRIP_INTERMEDIATE_TIPS_FAILURE_ACTION = 'NEWTRIP_INTERMEDIATE_TIPS_FAILURE_ACTION'

export const NEWTRIP_CLEAN = 'NEWTRIP_CLEAN'

export const newTripUpdateIntermediateRequestAction = (params: NewTripUpdateIntermediateRequest) => ({
  type: NEWTRIP_UPDATE_INTERMEDIATE_REQUEST,
  params,
})
export const newTripUpdateIntermediateSuccessAction = (payload: NewTripUpdateIntermediateSuccessResponse) => ({
  type: NEWTRIP_UPDATE_INTERMEDIATE_SUCCESS,
  payload,
})
export const newTripUpdateIntermediateFailureAction = (payload: ApiErrorResponse) => ({
  type: NEWTRIP_UPDATE_INTERMEDIATE_FAILURE,
  payload,
})

export const newTripGetIntermediateSuggestRequestAction = (params: PlaceRequest) => ({
  type: NEWTRIP_GET_INTERMEDIATE_SUGGEST_REQUEST,
  params,
})
export const newTripGetIntermediateSuggestSuccessAction = (payload: PlaceSuccessResponse) => ({
  type: NEWTRIP_GET_INTERMEDIATE_SUGGEST_SUCCESS,
  payload,
})
export const newTripGetIntermediateSuggestFailureAction = (payload: ApiErrorResponse) => ({
  type: NEWTRIP_GET_INTERMEDIATE_SUGGEST_FAILURE,
  payload,
})

export const newTripUpdateIntermediatePriceAction = (params: IntermediateCityType) => ({
  type: NEWTRIP_UPDATE_INTERMEDIATE_PRICE,
  params,
})

export const editTripUpdateIntermediatePriceAction = (params: IntermediateCityType) => ({
  type: NEWTRIP_UPDATE_INTERMEDIATE_PRICE,
  params,
})

export const newTripSetDetailsAction = (params: NewTripDetails) => ({
  type: NEWTRIP_SET_DETAILS,
  params,
})

export const newTripPublishRequestAction = () => ({
  type: NEWTRIP_PUBLISH_REQUEST,
})
export const newTripPublishSuccessAction = (payload: NewTripPublishSuccessResponse) => ({
  type: NEWTRIP_PUBLISH_SUCCESS,
  payload,
})
export const newTripPublishFailureAction = (payload: ApiErrorResponse) => ({
  type: NEWTRIP_PUBLISH_FAILURE,
  payload,
})

export const newTripIntermediateTipsRequestAction = (params: IntermediateTipsRequest) => ({
  type: NEWTRIP_INTERMEDIATE_TIPS_REQUEST_ACTION,
  params,
})
export const newTripIntermediateTipsSuccessAction = (payload: IntermediateTipsSuccessResponse) => ({
  type: NEWTRIP_INTERMEDIATE_TIPS_SUCCESS_ACTION,
  payload,
})
export const newTripIntermediateTipsFailureAction = (payload: ApiErrorResponse) => ({
  type: NEWTRIP_INTERMEDIATE_TIPS_FAILURE_ACTION,
  payload,
})
export const priceUpdateAction = (params: TripPriceUpdateRequest) => ({
  type: EDIT_TRIP_PRICE_REQUEST,
  params,
})

export const detailUpdateAction = (params: TripDetailUpdateRequest) => ({
  type: EDIT_TRIP_DETAIL_REQUEST,
  params,
})

export const timeUpdateAction = (params: TripTimeUpdateRequest) => ({
  type: EDIT_TRIP_TIME_REQUEST,
  params,
})

export const routeUpdateAction = (params: any) => ({
  type: EDIT_TRIP_ROUTE_REQUEST,
  params,
})

export const newTripCleanAction = () => ({ type: NEWTRIP_CLEAN })

export const initialState: NewTripState = {
  intermediate_cities: [
    { id: 1, main_text: 'Казань', waypoint: { price: 10 } },
    { id: 2, main_text: 'Москва', waypoint: { price: 20 } },
    { id: 3, main_text: 'Чебоксары', waypoint: { price: 30 } },
    { id: 4, main_text: 'Владимир', waypoint: { price: 40 } },
    { id: 5, main_text: 'Москва', waypoint: { price: 50 } },
  ],
  intermediate_cities_fetching: false,
  intermediate_cities_error: null,
  intermadiate_suggests: null,
  intermadiate_suggests_error: null,
  details: null,
  publish_trip_fetching: false,
  publish_trip_error: null,
  intermediate_tips: null,
  intermediate_tips_fetching: false,
  intermediate_tips_error: null,
}

const NewTripReducer = (state = initialState, action: Action<any>): NewTripState => {
  const { type, payload, params } = action
  switch (type) {
    case NEWTRIP_UPDATE_INTERMEDIATE_REQUEST: {
      const { cities } = action.params as NewTripUpdateIntermediateRequest
      return {
        ...state,
        intermediate_cities: cities,
        intermediate_cities_error: null,
        intermediate_cities_fetching: true,
        intermadiate_suggests: null,
      }
    }
    case NEWTRIP_UPDATE_INTERMEDIATE_SUCCESS: {
      const { cities } = payload as NewTripUpdateIntermediateSuccessResponse
      return {
        ...state,
        intermediate_cities_fetching: false,
        intermediate_cities: cities,
      }
    }
    case NEWTRIP_UPDATE_INTERMEDIATE_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return {
        ...state,
        intermediate_cities_fetching: false,
        intermediate_cities_error: error,
      }
    }
    case NEWTRIP_GET_INTERMEDIATE_SUGGEST_REQUEST: {
      return { ...state, intermadiate_suggests_error: null }
    }
    case NEWTRIP_GET_INTERMEDIATE_SUGGEST_SUCCESS: {
      const { cities } = payload as PlaceSuccessResponse
      return { ...state, intermadiate_suggests: cities }
    }
    case NEWTRIP_GET_INTERMEDIATE_SUGGEST_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, intermediate_cities_error: error }
    }
    case NEWTRIP_UPDATE_INTERMEDIATE_PRICE: {
      const city: IntermediateCityType = action.params
      const _cities = [...(state.intermediate_cities || [])]
      const index = _cities.map((city) => city.id).indexOf(city.id)
      _cities[index] = city
      return { ...state, intermediate_cities: _cities }
    }
    case NEWTRIP_SET_DETAILS: {
      const details = action.params as NewTripDetails
      const _details = Object.keys(details).length ? { ...(state.details || {}), ...details } : null
      return { ...state, details: _details }
    }
    case NEWTRIP_PUBLISH_REQUEST: {
      return {
        ...state,
        publish_trip_fetching: true,
        publish_trip_error: null,
      }
    }
    case NEWTRIP_PUBLISH_SUCCESS:
    case NEWTRIP_CLEAN: {
      return { ...initialState }
    }
    case NEWTRIP_PUBLISH_FAILURE: {
      const { error } = action.payload as ApiErrorResponse
      return { ...state, publish_trip_error: error }
    }
    case NEWTRIP_INTERMEDIATE_TIPS_REQUEST_ACTION: {
      return {
        ...state,
        intermediate_tips_fetching: true,
        intermediate_tips_error: null,
      }
    }
    case NEWTRIP_INTERMEDIATE_TIPS_SUCCESS_ACTION: {
      const { cities: intermediate_tips } = action.payload as IntermediateTipsSuccessResponse
      return { ...state, intermediate_tips_fetching: false, intermediate_tips }
    }
    case NEWTRIP_INTERMEDIATE_TIPS_FAILURE_ACTION: {
      const { error: intermediate_tips_error } = action.payload as ApiErrorResponse
      return {
        ...state,
        intermediate_tips_fetching: false,
        intermediate_tips_error,
      }
    }
    default:
      return state
  }
}

export default NewTripReducer
