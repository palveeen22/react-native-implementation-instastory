import {
  ApiFailure,
  ApiErrorResponse,
  TripsSuccessResponse,
  Nullable,
  TripSearchRequest,
  TripsSearchResponse,
  TripInfoType,
  TripsResponse,
  TripDetailRequest,
  TripDetailResponse,
  TripSearchFilterType,
  TripsRequest,
  TripCancelBookingRequest,
  TripCancelBookingSuccessResponse,
  TripBookingRequest,
  TripBookingSuccessResponse,
  TripCancelRequest,
  TripCancelSuccessResponse,
  TripSearch,
  Action,
  TripSearchFiltersTime,
  TripSearchFiltersUpdateRequest,
  TripSearchFiltersUpdateSuccessResponse,
} from '../../types'
import { AUTH_LOGOUT_SUCCESS } from './auth'

export interface TripState {
  published: Nullable<TripInfoType[]>
  published_page: number
  published_limit: number
  published_total: number
  published_fetching: boolean
  published_error: Nullable<ApiFailure>
  booked: Nullable<TripInfoType[]>
  booked_page: number
  booked_limit: number
  booked_total: number
  booked_fetching: boolean
  booked_error: Nullable<ApiFailure>

  published_archive: Nullable<TripInfoType[]>
  published_page_archive: number
  published_limit_archive: number
  published_total_archive: number
  published_fetching_archive: boolean
  published_error_archive: Nullable<ApiFailure>
  booked_archive: Nullable<TripInfoType[]>
  booked_page_archive: number
  booked_limit_archive: number
  booked_total_archive: number
  booked_fetching_archive: boolean
  booked_error_archive: Nullable<ApiFailure>

  search_request: Nullable<TripSearch>
  search_fetching: boolean
  search_error: Nullable<ApiFailure>
  search_response: Nullable<TripInfoType[]>
  search_filters: Nullable<TripSearchFilterType>
  search_page: number
  search_limit: number
  search_total: number
  search_times: Nullable<TripSearchFiltersTime>

  trip_info: Nullable<TripInfoType>
  trip_info_fetching: boolean
  trip_info_error: Nullable<ApiFailure>

  trip_info_update: Nullable<TripInfoType>

  cancel_booking_fetching: boolean
  cancel_booking_error: Nullable<ApiFailure>

  trip_booking_fetching: boolean
  trip_booking_error: Nullable<ApiFailure>

  trip_cancel_fetching: boolean
  trip_cancel_error: Nullable<ApiFailure>

  trip_finish_fetching: boolean
  trip_finish_error: Nullable<ApiFailure>

  filters_fetching: boolean
  filters_error: Nullable<ApiFailure>
}

export const TRIP_BOOKED_REQUEST = 'TRIP_BOOKED_REQUEST'
export const TRIP_BOOKED_SUCCESS = 'TRIP_BOOKED_SUCCESS'
export const TRIP_BOOKED_FAILURE = 'TRIP_BOOKED_FAILURE'

export const TRIP_PUBLISHED_REQUEST = 'TRIP_PUBLISHED_REQUEST'
export const TRIP_PUBLISHED_SUCCESS = 'TRIP_PUBLISHED_SUCCESS'
export const TRIP_PUBLISHED_FAILURE = 'TRIP_PUBLISHED_FAILURE'

//HERE
export const TRIP_PUBLISHED_ARCHIVE_REQUEST = 'TRIP_PUBLISHED_ARCHIVE_REQUEST'
export const TRIP_PUBLISHED_ARCHIVE_SUCCESS = 'TRIP_PUBLISHED_ARCHIVE_SUCCESS'
export const TRIP_PUBLISHED_ARCHIVE_FAILURE = 'TRIP_PUBLISHED_ARCHIVE_FAILURE'

export const TRIP_BOOKED_ARCHIVE_REQUEST = 'TRIP_BOOKED_ARCHIVE_REQUEST'
export const TRIP_BOOKED_ARCHIVE_SUCCESS = 'TRIP_BOOKED_ARCHIVE_SUCCESS'
export const TRIP_BOOKED_ARCHIVE_FAILURE = 'TRIP_BOOKED_ARCHIVE_FAILURE'
//UNTUL HERE

export const TRIP_SEARCH_REQUEST = 'TRIP_SEARCH_REQUEST'
export const TRIP_SEARCH_SUCCESS = 'TRIP_SEARCH_SUCCESS'
export const TRIP_SEARCH_FAILURE = 'TRIP_SEARCH_FAILURE'

export const TRIP_DETAIL_REQUEST = 'TRIP_DETAIL_REQUEST'
export const TRIP_DETAIL_SUCCESS = 'TRIP_DETAIL_SUCCESS'
export const TRIP_DETAIL_FAILURE = 'TRIP_DETAIL_FAILURE'

export const TRIP_SEARCH_SET_FILTER = 'TRIP_SEARCH_SET_FILTER'

export const TRIP_SEARCH_UPDATE_FILTER_REQUEST = 'TRIP_SEARCH_UPDATE_FILTER_REQUEST'
export const TRIP_SEARCH_UPDATE_FILTER_SUCCESS = 'TRIP_SEARCH_UPDATE_FILTER_SUCCESS'
export const TRIP_SEARCH_UPDATE_FILTER_FAILURE = 'TRIP_SEARCH_UPDATE_FILTER_FAILURE'

export const TRIP_CANCEL_BOOKING_REQUEST = 'TRIP_CANCEL_BOOKING_REQUEST'
export const TRIP_CANCEL_BOOKING_SUCCESS = 'TRIP_CANCEL_BOOKING_SUCCESS'
export const TRIP_CANCEL_BOOKING_FAILURE = 'TRIP_CANCEL_BOOKING_FAILURE'

export const TRIP_BOOKING_REQUEST = 'TRIP_BOOKING_REQUEST'
export const TRIP_BOOKING_SUCCESS = 'TRIP_BOOKING_SUCCESS'
export const TRIP_BOOKING_FAILURE = 'TRIP_BOOKING_FAILURE'

export const TRIP_CANCEL_REQUEST = 'TRIP_CANCEL_REQUEST'
export const TRIP_CANCEL_SUCCESS = 'TRIP_CANCEL_SUCCESS'
export const TRIP_CANCEL_FAILURE = 'TRIP_CANCEL_FAILURE'
export const TRIP_UPDATE_TIME_REQUEST = 'TRIP_UPDATE_TIME_REQUEST'

export const TRIP_FINISH_REQUEST = 'TRIP_FINISH_REQUEST'
export const TRIP_FINSIH_SUCCESS = 'TRIP_FINSIH_SUCCESS'
export const TRIP_FINISH_FAILURE = 'TRIP_FINISH_FAILURE'

export const tripUpdateTimeRequestAction = (params: any) => ({
  type: TRIP_UPDATE_TIME_REQUEST,
  params,
})

export const tripsBookedRequestAction = (params: TripsRequest) => ({
  type: TRIP_BOOKED_REQUEST,
  params,
})
export const tripsBookedArchiveRequestAction = (params: TripsRequest) => ({
  type: TRIP_BOOKED_ARCHIVE_REQUEST,
  params,
})
export const tripsBookedSuccessAction = (payload: TripsResponse) => ({
  type: TRIP_BOOKED_SUCCESS,
  payload,
})
export const tripsBookedArchiveSuccessAction = (payload: TripsResponse) => ({
  type: TRIP_BOOKED_ARCHIVE_SUCCESS,
  payload,
})
export const tripsBookedFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_BOOKED_FAILURE,
  payload,
})
export const tripsBookedArchiveFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_BOOKED_ARCHIVE_FAILURE,
  payload,
})

export const tripsPublishedRequestAction = (params: TripsRequest) => ({
  type: TRIP_PUBLISHED_REQUEST,
  params,
})
export const tripsPublishedArchiveRequestAction = (params: TripsRequest) => ({
  type: TRIP_PUBLISHED_ARCHIVE_REQUEST,
  params,
})
export const tripsPublishedSuccessAction = (payload: TripsResponse) => ({
  type: TRIP_PUBLISHED_SUCCESS,
  payload,
})
export const tripsPublishedArchiveSuccessAction = (payload: TripsResponse) => ({
  type: TRIP_PUBLISHED_ARCHIVE_SUCCESS,
  payload,
})
export const tripsPublishedFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_PUBLISHED_FAILURE,
  payload,
})
export const tripsPublishedFailureArchiveAction = (payload: ApiErrorResponse) => ({
  type: TRIP_PUBLISHED_ARCHIVE_FAILURE,
  payload,
})

export const tripSearchRequestAction = (params: TripSearch) => ({
  type: TRIP_SEARCH_REQUEST,
  params,
})
export const tripSearchSuccessAction = (payload: TripsSearchResponse) => ({
  type: TRIP_SEARCH_SUCCESS,
  payload,
})
export const tripSearchFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_SEARCH_FAILURE,
  payload,
})
export const tripSearchSetFilterAction = (params: Nullable<TripSearchFilterType>) => ({
  type: TRIP_SEARCH_SET_FILTER,
  params,
})

export const tripSearchUpdateFiltersRequestAction = (params: TripSearchFiltersUpdateRequest) => ({
  type: TRIP_SEARCH_UPDATE_FILTER_REQUEST,
  params,
})
export const tripSearchUpdateFiltersSuccessAction = (payload: TripSearchFiltersUpdateSuccessResponse) => ({
  type: TRIP_SEARCH_UPDATE_FILTER_SUCCESS,
  payload,
})
export const tripSearchUpdateFiltersFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_SEARCH_UPDATE_FILTER_FAILURE,
  payload,
})

export const tripDetailRequestAction = (params: TripDetailRequest) => ({
  type: TRIP_DETAIL_REQUEST,
  params,
})
export const tripDetailSuccessAction = (payload: TripDetailResponse) => ({
  type: TRIP_DETAIL_SUCCESS,
  payload,
})
export const tripDetailFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_DETAIL_FAILURE,
  payload,
})

export const tripCancelBookingRequestAction = (params: TripCancelBookingRequest) => ({
  type: TRIP_CANCEL_BOOKING_REQUEST,
  params,
})
export const tripCancelBookingSuccessAction = (payload: TripCancelBookingSuccessResponse) => ({
  type: TRIP_CANCEL_BOOKING_SUCCESS,
  payload,
})
export const tripCancelBookingFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_CANCEL_BOOKING_FAILURE,
  payload,
})

export const tripBookingRequestAction = (params: TripBookingRequest) => ({
  type: TRIP_BOOKING_REQUEST,
  params,
})
export const tripBookingSuccessAction = (payload: TripBookingSuccessResponse) => ({
  type: TRIP_BOOKING_SUCCESS,
  payload,
})
export const tripBookingFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_BOOKING_FAILURE,
  payload,
})

export const tripCancelRequestAction = (params: TripCancelRequest) => ({
  type: TRIP_CANCEL_REQUEST,
  params,
})
export const tripFinishRequestAction = (params: TripCancelRequest) => ({
  type: TRIP_FINISH_REQUEST,
  params,
})
export const tripCancelSuccessAction = (payload: TripCancelSuccessResponse) => ({ type: TRIP_CANCEL_SUCCESS, payload })
export const tripCancelFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_CANCEL_FAILURE,
  payload,
})
export const tripFinishSuccessAction = (payload: TripCancelSuccessResponse) => ({ type: TRIP_FINSIH_SUCCESS, payload })
export const tripFinishFailureAction = (payload: ApiErrorResponse) => ({
  type: TRIP_FINISH_FAILURE,
  payload,
})

export const initialState: TripState = {
  published: null,
  published_page: 0,
  published_limit: 0,
  published_total: 0,
  published_fetching: false,
  published_error: null,
  booked: null,
  booked_page: 0,
  booked_limit: 0,
  booked_total: 0,
  booked_fetching: false,
  booked_error: null,

  published_archive: null,
  published_page_archive: 0,
  published_limit_archive: 0,
  published_total_archive: 0,
  published_fetching_archive: false,
  published_error_archive: null,
  booked_archive: null,
  booked_page_archive: 0,
  booked_limit_archive: 0,
  booked_total_archive: 0,
  booked_fetching_archive: false,
  booked_error_archive: null,

  search_fetching: false,
  search_request: null,
  search_error: null,
  search_response: null,
  search_filters: null,
  search_page: 0,
  search_limit: 0,
  search_total: 0,
  search_times: null,
  trip_info: null,
  trip_info_fetching: false,
  trip_info_error: null,
  trip_info_update: null,
  cancel_booking_fetching: false,
  cancel_booking_error: null,
  trip_booking_fetching: false,
  trip_booking_error: null,
  trip_cancel_fetching: false,
  trip_cancel_error: null,
  trip_finish_fetching: false,
  trip_finish_error: null,
  filters_fetching: false,
  filters_error: null,
}

const TripReducer = (state = initialState, action: Action<any>): TripState => {
  const { type, payload, params } = action
  switch (type) {
    case TRIP_SEARCH_REQUEST: {
      const params = action.params
      return { ...state, search_fetching: true, search_request: params }
    }
    case TRIP_SEARCH_SUCCESS: {
      const {
        rides,
        page: search_page,
        limit: search_limit,
        total: search_total,
        times: search_times,
      } = action.payload as TripsSearchResponse
      return {
        ...state,
        search_fetching: false,
        search_response: search_page === 1 ? rides : [...(state.search_response || []), ...rides],
        search_page,
        search_limit,
        search_total,
        search_times,
      }
    }
    case TRIP_SEARCH_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, search_fetching: false, search_error: error }
    }
    case TRIP_SEARCH_SET_FILTER: {
      const search_filters = action.params as TripSearchFilterType
      return { ...state, search_filters }
    }
    case TRIP_BOOKED_REQUEST: {
      return { ...state, booked_error: null, booked_fetching: true }
    }
    case TRIP_BOOKED_ARCHIVE_REQUEST: {
      return { ...state, booked_error_archive: null, booked_fetching_archive: true }
    }
    case TRIP_BOOKED_SUCCESS: {
      const {
        rides: booked,
        page: booked_page,
        limit: booked_limit,
        total: booked_total,
      } = payload as TripsSuccessResponse
      return {
        ...state,
        booked_fetching: false,
        booked: booked_page === 1 ? booked : [...(state.booked || []), ...booked],
        booked_page,
        booked_limit,
        booked_total,
        trip_info_update: null,
      }
    }
    case TRIP_BOOKED_ARCHIVE_SUCCESS: {
      const {
        rides: booked_archive,
        page: booked_page_archive,
        limit: booked_limit_archive,
        total: booked_total_archive,
      } = payload as TripsSuccessResponse
      return {
        ...state,
        booked_fetching: false,
        booked_archive:
          booked_page_archive === 1 ? booked_archive : [...(state.booked_archive || []), ...booked_archive],
        booked_page_archive,
        booked_limit_archive,
        booked_total_archive,
        trip_info_update: null,
      }
    }
    case TRIP_BOOKED_FAILURE: {
      const { error: booked_error } = payload as ApiErrorResponse
      return { ...state, booked_fetching: false, booked_error }
    }
    case TRIP_BOOKED_ARCHIVE_FAILURE: {
      const { error: booked_error_archive } = payload as ApiErrorResponse
      return { ...state, booked_fetching_archive: false, booked_error_archive }
    }
    case TRIP_PUBLISHED_REQUEST: {
      return { ...state, published_error: null, published_fetching: true }
    }
    case TRIP_PUBLISHED_ARCHIVE_REQUEST: {
      return { ...state, published_error_archive: null, published_fetching_archive: true }
    }
    case TRIP_PUBLISHED_SUCCESS: {
      const {
        rides: published,
        page: published_page,
        limit: published_limit,
        total: published_total,
      } = payload as TripsSuccessResponse
      return {
        ...state,
        published_fetching: false,
        published: published_page === 1 ? published : [...(state.published || []), ...published],
        published_page,
        published_limit,
        published_total,
        trip_info_update: null,
      }
    }
    case TRIP_PUBLISHED_ARCHIVE_SUCCESS: {
      const {
        rides: published_archive,
        page: published_page_archive,
        limit: published_limit_archive,
        total: published_total_archive,
      } = payload as TripsSuccessResponse
      return {
        ...state,
        published_fetching_archive: false,
        published_archive:
          published_page_archive === 1 ? published_archive : [...(state.published_archive || []), ...published_archive],
        published_page_archive,
        published_limit_archive,
        published_total_archive,
        trip_info_update: null,
      }
    }
    case TRIP_PUBLISHED_FAILURE: {
      const { error: published_error } = payload as ApiErrorResponse
      return { ...state, published_fetching: false, published_error }
    }
    case TRIP_PUBLISHED_ARCHIVE_FAILURE: {
      const { error: published_error_archive } = payload as ApiErrorResponse
      return { ...state, published_fetching_archive: false, published_error_archive }
    }
    case TRIP_DETAIL_REQUEST: {
      return { ...state, trip_info_fetching: true }
    }
    case TRIP_DETAIL_SUCCESS: {
      const { ride } = action.payload as TripDetailResponse
      return { ...state, trip_info_fetching: false, trip_info: ride }
    }
    case TRIP_DETAIL_FAILURE: {
      const { error } = action.payload as ApiErrorResponse
      return { ...state, trip_info_fetching: false, trip_info_error: error }
    }
    case TRIP_CANCEL_BOOKING_REQUEST: {
      return {
        ...state,
        cancel_booking_fetching: true,
        cancel_booking_error: null,
      }
    }
    case TRIP_CANCEL_BOOKING_SUCCESS: {
      const { rides: booked } = action.payload as TripCancelBookingSuccessResponse
      return { ...state, cancel_booking_fetching: false, booked }
    }
    case TRIP_CANCEL_BOOKING_FAILURE: {
      const { error: cancel_booking_error } = action.payload as ApiErrorResponse
      return { ...state, cancel_booking_fetching: false, cancel_booking_error }
    }
    case TRIP_BOOKING_REQUEST: {
      return {
        ...state,
        trip_booking_fetching: true,
        trip_booking_error: null,
      }
    }
    case TRIP_BOOKING_SUCCESS: {
      return { ...state, trip_booking_fetching: false }
    }
    case TRIP_BOOKING_FAILURE: {
      const { error: trip_booking_error } = action.payload as ApiErrorResponse
      return { ...state, trip_booking_fetching: false, trip_booking_error }
    }
    case TRIP_CANCEL_REQUEST: {
      return { ...state, trip_cancel_fetching: true, trip_cancel_error: null }
    }
    case TRIP_FINISH_REQUEST: {
      return { ...state, trip_finish_fetching: true, trip_finish_error: null }
    }
    case TRIP_CANCEL_SUCCESS: {
      const { rides: published } = action.payload as TripCancelSuccessResponse
      return { ...state, trip_cancel_fetching: false, published }
    }
    case TRIP_FINSIH_SUCCESS: {
      const { rides: published } = action.payload as TripCancelSuccessResponse
      return { ...state, trip_finish_fetching: false, published }
    }
    case TRIP_UPDATE_TIME_REQUEST: {
      const { ride } = action.params
      const newMap = state.published.map((e) => (e.id === ride.id ? ride : e))
      return { ...state, published: newMap, trip_info_update: ride }
    }
    case TRIP_CANCEL_FAILURE: {
      const { error: trip_cancel_error } = action.payload as ApiErrorResponse
      return { ...state, trip_cancel_fetching: false, trip_cancel_error }
    }
    case TRIP_FINISH_FAILURE: {
      const { error: trip_finish_error } = action.payload as ApiErrorResponse
      return { ...state, trip_finish_fetching: false, trip_finish_error }
    }
    case TRIP_SEARCH_UPDATE_FILTER_REQUEST: {
      return { ...state, filters_fetching: true, filters_error: null }
    }
    case TRIP_SEARCH_UPDATE_FILTER_SUCCESS: {
      const { times: search_times } = action.payload as TripSearchFiltersUpdateSuccessResponse
      return { ...state, filters_fetching: false, search_times }
    }
    case TRIP_SEARCH_UPDATE_FILTER_FAILURE: {
      const { error: filters_error } = action.payload as ApiErrorResponse
      return { ...state, filters_fetching: false, filters_error }
    }
    case AUTH_LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default TripReducer
