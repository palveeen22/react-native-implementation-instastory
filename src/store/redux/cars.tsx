import {
  ApiFailure,
  ApiErrorResponse,
  CarsSuccessResponse,
  Nullable,
  CarType,
  CarColorType,
  CarsColorsSuccessResponse,
  CarsAddCarSuccessResponse,
  CarsAddCarRequest,
  CarsUpdateCarRequest,
  CarsUpdateCarSuccessResponse,
  CarsDeleteCarRequest,
  CarsDeleteCarSuccessResponse,
} from '../../types'
import { AUTH_LOGOUT_SUCCESS } from './auth'

export interface CarsState {
  cars: Nullable<CarType[]>
  limit: Nullable<number>
  page: Nullable<number>
  total: Nullable<number>
  fetching: boolean
  error: Nullable<ApiFailure>
  colors: Nullable<CarColorType[]>
  colors_fetching: boolean
  colors_error: Nullable<ApiFailure>
}

export const CARS_REQUEST = 'CARS_REQUEST'
export const CARS_SUCCESS = 'CARS_SUCCESS'
export const CARS_FAILURE = 'CARS_FAILURE'

export const CARS_COLORS_REQUEST = 'CARS_COLORS_REQUEST'
export const CARS_COLORS_SUCCESS = 'CARS_COLORS_SUCCESS'
export const CARS_COLORS_FAILURE = 'CARS_COLORS_FAILURE'

export const CARS_ADD_CAR_REQUEST = 'CARS_ADD_CAR_REQUEST'
export const CARS_ADD_CAR_SUCCESS = 'CARS_ADD_CAR_SUCCESS'
export const CARS_ADD_CAR_FAILURE = 'CARS_ADD_CAR_FAILURE'

export const CARS_UPDATE_CAR_REQUEST = 'CARS_UPDATE_CAR_REQUEST'
export const CARS_UPDATE_CAR_SUCCESS = 'CARS_UPDATE_CAR_SUCCESS'
export const CARS_UPDATE_CAR_FAILURE = 'CARS_UPDATE_CAR_FAILURE'

export const CARS_DELETE_CAR_REQUEST = 'CARS_DELETE_CAR_REQUEST'
export const CARS_DELETE_CAR_SUCCESS = 'CARS_DELETE_CAR_SUCCESS'
export const CARS_DELETE_CAR_FAILURE = 'CARS_DELETE_CAR_FAILURE'

export const carsRequestAction = () => ({ type: CARS_REQUEST })
export const carsSuccessAction = (payload: CarsSuccessResponse) => ({
  type: CARS_SUCCESS,
  payload,
})
export const carsFailureAction = (payload: ApiErrorResponse) => ({
  type: CARS_FAILURE,
  payload,
})

export const carsColorsRequestAction = () => ({ type: CARS_COLORS_REQUEST })
export const carsColorsSuccessAction = (payload: CarsColorsSuccessResponse) => ({ type: CARS_COLORS_SUCCESS, payload })
export const carsColorsFailureAction = (payload: ApiErrorResponse) => ({
  type: CARS_COLORS_FAILURE,
  payload,
})

export const carsAddCarRequestAction = (params: CarsAddCarRequest) => ({
  type: CARS_ADD_CAR_REQUEST,
  params,
})
export const carsAddCarSuccessAction = (payload: CarsAddCarSuccessResponse) => ({ type: CARS_ADD_CAR_SUCCESS, payload })
export const carsAddCarFailureAction = (payload: ApiErrorResponse) => ({
  type: CARS_ADD_CAR_FAILURE,
  payload,
})

export const carsUpdateCarRequestAction = (params: CarsUpdateCarRequest) => ({
  type: CARS_UPDATE_CAR_REQUEST,
  params,
})
export const carsUpdateCarSuccessAction = (payload: CarsUpdateCarSuccessResponse) => ({
  type: CARS_UPDATE_CAR_SUCCESS,
  payload,
})
export const carsUpdateCarFailureAction = (payload: ApiErrorResponse) => ({
  type: CARS_UPDATE_CAR_FAILURE,
  payload,
})

export const carsDeleteCarRequestAction = (params: CarsDeleteCarRequest) => ({
  type: CARS_DELETE_CAR_REQUEST,
  params,
})
export const carsDeleteCarSuccessAction = (payload: CarsDeleteCarSuccessResponse) => ({
  type: CARS_DELETE_CAR_SUCCESS,
  payload,
})
export const carsDeleteCarFailureAction = (payload: ApiErrorResponse) => ({
  type: CARS_DELETE_CAR_FAILURE,
  payload,
})

export const initialState: CarsState = {
  cars: null,
  limit: null,
  page: null,
  total: null,
  fetching: false,
  error: null,
  colors: null,
  colors_fetching: false,
  colors_error: null,
}

const CarsReducer = (state = initialState, action: any): CarsState => {
  const { type, payload, params } = action
  switch (type) {
    case CARS_REQUEST:
    case CARS_ADD_CAR_REQUEST:
    case CARS_UPDATE_CAR_REQUEST:
    case CARS_DELETE_CAR_REQUEST: {
      return { ...state, error: null, fetching: true }
    }
    case CARS_SUCCESS: {
      const { cars, limit, page, total } = payload as CarsSuccessResponse
      return { ...state, fetching: false, cars, limit, page, total }
    }
    case CARS_ADD_CAR_SUCCESS:
    case CARS_UPDATE_CAR_SUCCESS:
    case CARS_DELETE_CAR_SUCCESS: {
      return { ...state, fetching: false }
    }
    case CARS_FAILURE:
    case CARS_ADD_CAR_FAILURE:
    case CARS_UPDATE_CAR_FAILURE:
    case CARS_DELETE_CAR_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, fetching: false, error }
    }
    case CARS_COLORS_REQUEST: {
      return { ...state, colors_error: null, colors_fetching: true }
    }
    case CARS_COLORS_SUCCESS: {
      const { colors } = payload as CarsColorsSuccessResponse
      return { ...state, colors_fetching: false, colors }
    }
    case CARS_COLORS_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, colors_fetching: false, colors_error: error }
    }
    case AUTH_LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default CarsReducer
