/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { store } from './store'
import config from './config'
import apisauce, {
  ApiResponse as _ApiResponse,
  ApiOkResponse as _ApiOkResponse,
  ApiErrorResponse as _ApiErrorResponse,
} from 'apisauce'
import { showMessage } from 'react-native-flash-message'
import {
  AuthRequest,
  AuthSuccessResponse,
  AddCarRequest,
  CarsAddCarSuccessResponse,
  CarsBrandRerquest,
  CarsBrandSuccessResponse,
  CarsColorsRerquest,
  CarsColorsSuccessResponse,
  CarsModelsRerquest,
  CarsModelsSuccessResponse,
  CarsRequest,
  CarsSuccessResponse,
  NotificationsReadRequest,
  NotificationsReadSuccessResponse,
  NotificationsRequest,
  NotificationsSuccessResponse,
  PickedFileType,
  UserProfileRequest,
  UserProfileSuccessResponse,
  UserProfileUpdateRequest,
  UpdateCarRequest,
  PlaceRequest,
  PlaceSuccessResponse,
  CarsDeleteCarRequest,
  CarsDeleteCarSuccessResponse,
  IntermediateCalculateRequest,
  IntermediateCalculateSuccessResponse,
  NewTripPublishRequest,
  NewTripPublishSuccessResponse,
  TripsRequest,
  TripsResponse,
  TripCancelBookingRequest,
  TripCancelBookingSuccessResponse,
  TripSearchRequest,
  TripsSearchResponse,
  TripDetailRequest,
  TripDetailResponse,
  TripBookingRequest,
  TripBookingSuccessResponse,
  TripCancelRequest,
  TripCancelSuccessResponse,
  CountriesRequest,
  CountriesSuccessResponse,
  CountryRequest,
  CountrySuccessResponse,
  RegisterDeviceRequest,
  RegisterDeviceSuccess,
  IntermediateTipsRequest,
  IntermediateTipsSuccessResponse,
  TripSearchFiltersUpdateRequest,
  TripSearchFiltersUpdateSuccessResponse,
  logoutResponse,
  LogoutRequest,
  TripPriceUpdateRequest,
  AuthRequestGoogle,
  AuthRequestTelegram,
  AuthRequestApple,
  AuthRequestYandex,
  UserStorySuccessResponse,
} from './types'
import { authLogoutSuccessAction } from './store/redux/auth'
import { t } from './localization'

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse
export type ApiSuccessResponse<T> = _ApiOkResponse<{
  success: boolean
  result?: T
}>
export type ApiFailureResponse = _ApiErrorResponse<ApiErrorResponse>
export type ApiErrorResponse = {
  error: ApiFailure
}

export interface ApiFailure {
  message: string
  code: number
  reason: string
}

function showAlert(message: string) {
  showMessage({
    type: 'danger',
    message,
    duration: config.messageDuration,
  })
}
const AuthorizationToken = 'Xopqersv1ZzRU7usXONvODQNrh5LN1XYH08TdPRYQJyqO4ZekS'

export const PATHS = {
  AUTH: 'auth',
  USER: 'client',
  NOTIFICATIONS: 'notifications',
  CAR: 'car',
  PLACES: 'places',
  RIDE: 'ride',
  COUNTRIES: 'country',
}

const create = (baseURL: string = config.api.url, showLogs = true) => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  })

  api.addMonitor((res) => {
    showLogs &&
      config.api.showLogs &&
      console.log(res.status, res.config?.method?.toUpperCase(), res.config?.url, { res })
    if (!res.ok) {
      const response = res as ApiFailureResponse
      let message = response.data?.error?.reason
      if (response.status == 401 || response.status == 403) {
        store.dispatch(authLogoutSuccessAction())
      } else {
        if (!response.status) {
          switch (response.problem) {
            case 'CLIENT_ERROR':
            case 'SERVER_ERROR':
            case 'TIMEOUT_ERROR':
            case 'CONNECTION_ERROR':
            case 'NETWORK_ERROR': {
              message = t(response.problem)
              break
            }
            default:
              message = t('UNKNOWN_ERROR')
          }
        }
      }
      if (response?.data?.error?.code == 429) {
        showAlert("Подождите перед отправкой нового сообщения")
      } else if (![1003].includes(response?.data?.error?.code)) {
        showAlert(message || response.data?.error?.message)
      }
      return response
    }
    return res
  })

  api.addRequestTransform((request) => {
    const state = store.getState()
    const token = state.auth.token || ''
    request.headers.Authorization = `Bearer ${token}`
  })

  api.addResponseTransform((response) => {
    if (!response.ok && !response.data?.error) {
      response.data = {
        ...(response.data || {}),
        error: {
          message: null,
          code: response.status,
          reason: response.problem,
        },
      }
    }
  })

  const authRequest = (params: AuthRequest | AuthRequestTelegram): Promise<ApiResponse<AuthSuccessResponse>> => {
    return api.post(PATHS.AUTH, {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })
  }

  const authConfirmRequest = (params: AuthRequest | AuthRequestTelegram): Promise<ApiResponse<AuthSuccessResponse>> =>
    api.post(PATHS.AUTH + '/confirm', {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })

  const authConfirmRequestGoogle = (params: AuthRequestGoogle): Promise<ApiResponse<AuthSuccessResponse>> =>
    api.post(PATHS.AUTH + '/confirm/google', {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })

  const authConfirmRequestApple = (params: AuthRequestApple): Promise<ApiResponse<AuthSuccessResponse>> =>
    api.post(PATHS.AUTH + '/confirm/apple', {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })

  const authConfirmRequestYandex = (params: AuthRequestYandex): Promise<ApiResponse<AuthSuccessResponse>> =>
    api.post(PATHS.AUTH + '/confirm/yandex', {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })

  const authConfirmRequestTelegram = (params: AuthRequestTelegram): Promise<ApiResponse<AuthSuccessResponse>> =>
    api.get(PATHS.AUTH + `/telegram_token?number=${params.phone}`, {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })

  const userProfileRequest = (params: UserProfileRequest): Promise<ApiResponse<UserProfileSuccessResponse>> =>
    api.get(PATHS.USER)

  //HERE UserStorySuccessResponse
  const userStoriesRequest = (): Promise<ApiResponse<UserStorySuccessResponse>> => {
    return api.get('history/app/instructions')
  }

  const userProfileGoogleRequest = (params: UserProfileRequest): Promise<ApiResponse<UserProfileSuccessResponse>> =>
    api.get(PATHS.USER)

  const userProfileUpdateRequest = (data: UserProfileUpdateRequest): Promise<ApiResponse<UserProfileSuccessResponse>> =>
    api.patch(`${PATHS.USER}`, data)

  const userProfileDeleteRequest = (): Promise<ApiResponse<null>> => api.delete(PATHS.USER)

  const uploadUserPhoto = (file: PickedFileType): Promise<ApiResponse<number>> =>
    uploadFile(`${PATHS.USER}/upload_photo`, file)

  const uploadFile = (path: string, file: PickedFileType): Promise<ApiResponse<number>> => {
    var bodyFormData = new FormData()
    file.uri = decodeURI(file.uri)
    // @ts-ignore
    bodyFormData.append('file', file)
    return api.post(path, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  const notificationsRequest = (params: NotificationsRequest): Promise<ApiResponse<NotificationsSuccessResponse>> =>
    api.get(PATHS.NOTIFICATIONS)

  const notificationsReadRequest = (
    params: NotificationsReadRequest
  ): Promise<ApiResponse<NotificationsReadSuccessResponse>> => api.patch(PATHS.NOTIFICATIONS)

  const getCars = (params: CarsRequest): Promise<ApiResponse<CarsSuccessResponse>> => api.get(PATHS.CAR)

  const getCarColors = (params: CarsColorsRerquest): Promise<ApiResponse<CarsColorsSuccessResponse>> =>
    api.get(PATHS.CAR + '/colors')

  const getCarBrandSuggest = (params: CarsBrandRerquest): Promise<ApiResponse<CarsBrandSuccessResponse>> =>
    api.get(PATHS.CAR + '/search/maker', params)

  const getCarModelsSuggest = (params: CarsModelsRerquest): Promise<ApiResponse<CarsModelsSuccessResponse>> =>
    api.get(PATHS.CAR + '/search/model', params)

  const addCarRequest = (data: AddCarRequest): Promise<ApiResponse<CarsAddCarSuccessResponse>> =>
    api.put(PATHS.CAR, data)

  const uploadCarPhoto = (file: PickedFileType): Promise<ApiResponse<number>> =>
    uploadFile(`${PATHS.CAR}/upload_photo`, file)

  const updateCarRequest = (data: UpdateCarRequest): Promise<ApiResponse<any>> =>
    api.patch(PATHS.CAR + `/${data.id}`, data)

  const deleteCarRequest = (params: CarsDeleteCarRequest): Promise<ApiResponse<CarsDeleteCarSuccessResponse>> =>
    api.delete(PATHS.CAR + `/${params.id}`)

  const getPlace = (params: PlaceRequest): Promise<ApiResponse<PlaceSuccessResponse>> =>
    api.get(`${PATHS.PLACES}/autocomplete`, params)

  const updatePriceRequest = (data: any): Promise<ApiResponse<CarsAddCarSuccessResponse>> => {
    return api.patch(PATHS.RIDE + `/update/cost/${data?.id}`, { rides: data?.rides })
  }

  const updateDetailRequest = (data: any): Promise<ApiResponse<CarsAddCarSuccessResponse>> => {
    return api.patch(PATHS.RIDE + `/update/details/${data?.id}`, data?.request)
  }

  const updateTimeRequest = (data: any): Promise<ApiResponse<CarsAddCarSuccessResponse>> => {
    return api.patch(PATHS.RIDE + `/update/time/${data?.id}`, data?.request)
  }

  const updateRouteRequest = (data: any): Promise<ApiResponse<CarsAddCarSuccessResponse>> => {
    return api.patch(PATHS.RIDE + `/update/destination/${data?.id}`, data?.request)
  }

  const calcultateIntermediate = (
    data: IntermediateCalculateRequest
  ): Promise<ApiResponse<IntermediateCalculateSuccessResponse>> => api.post(`${PATHS.RIDE}/calculate`, data)

  const getRideDetail = (params: TripDetailRequest): Promise<ApiResponse<TripDetailResponse>> =>
    // return api.get(PATHS.RIDE, params)
    new Promise((resolve) => {
      setTimeout(() => resolve(errorResponse()), 500)
    })

  const publishTrip = (data: NewTripPublishRequest): Promise<ApiResponse<NewTripPublishSuccessResponse>> =>
    api.put(PATHS.RIDE, data)

  const getTrips = (params: TripsRequest): Promise<ApiResponse<TripsResponse>> => api.get(`${PATHS.RIDE}/my`, params)

  const getTripsArchive = (params: TripsRequest): Promise<ApiResponse<TripsResponse>> => api.get(`${PATHS.RIDE}/archive`, params)

  const searchTrips = (params: TripSearchRequest): Promise<ApiResponse<TripsSearchResponse>> =>
    api.get(`${PATHS.RIDE}/search`, params)

  const searchTripsFilter = (
    params: TripSearchFiltersUpdateRequest
  ): Promise<ApiResponse<TripSearchFiltersUpdateSuccessResponse>> => api.get(`${PATHS.RIDE}/filter`, params)

  const bookingTrip = (params: TripBookingRequest): Promise<ApiResponse<TripBookingSuccessResponse>> =>
    api.post(`${PATHS.RIDE}/book`, params)

  const cancelBooking = (params: TripCancelBookingRequest): Promise<ApiResponse<TripCancelBookingSuccessResponse>> =>
    api.post(`${PATHS.RIDE}/unbook`, params)

  const cancelTrip = (params: TripCancelRequest): Promise<ApiResponse<TripCancelSuccessResponse>> =>
    api.delete(`${PATHS.RIDE}/${params.ride_id}`)

  const finishTrip = (params: TripCancelRequest): Promise<ApiResponse<TripCancelSuccessResponse>> =>
    api.delete(`${PATHS.RIDE}/finish/${params.ride_id}`)

  const getCountries = (params: CountriesRequest): Promise<ApiResponse<CountriesSuccessResponse>> =>
    api.get(PATHS.COUNTRIES, {}, { headers: { 'AuthorizationToken': AuthorizationToken }, params })

  const getCountry = (params: CountryRequest): Promise<ApiResponse<CountrySuccessResponse>> =>
    api.get(`${PATHS.COUNTRIES}/${params.country_id}`, {}, { headers: { 'AuthorizationToken': AuthorizationToken } })

  const registerDevice = (params: RegisterDeviceRequest): Promise<ApiResponse<RegisterDeviceSuccess>> =>
    api.patch(`${PATHS.USER}/device`, params)

  const logout = (params: LogoutRequest): Promise<ApiResponse<logoutResponse>> =>
    api.post(`${PATHS.USER}/logout`, params)

  const intermediateTipsRequest = (
    params: IntermediateTipsRequest
  ): Promise<ApiResponse<IntermediateTipsSuccessResponse>> => api.get(`${PATHS.RIDE}/intermediate`, params)

  return {
    axiosInstance: api.axiosInstance,
    authRequest,
    authConfirmRequest,
    authConfirmRequestGoogle,
    authConfirmRequestApple,
    authConfirmRequestYandex,
    authConfirmRequestTelegram,
    userProfileRequest,
    userStoriesRequest,
    userProfileGoogleRequest,
    notificationsRequest,
    notificationsReadRequest,
    userProfileUpdateRequest,
    userProfileDeleteRequest,
    uploadUserPhoto,
    getCars,
    getCarColors,
    getCarBrandSuggest,
    getCarModelsSuggest,
    uploadCarPhoto,
    addCarRequest,
    updateCarRequest,
    getPlace,
    deleteCarRequest,
    calcultateIntermediate,
    publishTrip,
    getTrips,
    getTripsArchive,
    searchTrips,
    searchTripsFilter,
    cancelBooking,
    cancelTrip,
    finishTrip,
    getRideDetail,
    bookingTrip,
    getCountries,
    getCountry,
    registerDevice,
    intermediateTipsRequest,
    logout,
    updatePriceRequest,
    updateDetailRequest,
    updateTimeRequest,
    updateRouteRequest,
  }
}

export default { create }

function errorResponse(): ApiFailureResponse {
  const message = 'Метод не реализован'
  showMessage({
    type: 'danger',
    message,
    duration: config.messageDuration,
  })
  return {
    status: 0,
    ok: false,
    originalError: null,
    problem: null,
    data: {
      error: {
        message,
        code: 0,
        reason: null,
      },
    },
  }
}
