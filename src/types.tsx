import { ApiFailure, ApiFailureResponse, ApiResponse, ApiErrorResponse } from './api'
import { api } from './store/saga'
export { ApiFailure, ApiFailureResponse, ApiResponse, ApiErrorResponse }

export interface RouteData {
  screenName: string
  showTabBar: boolean
}
export interface Route {
  name: string
  params: {
    showTabBar: boolean
  }
  state: {
    index: number
    routes: []
  }
}

export type ApiType = typeof api
export type Nullable<T> = T | null
export type Undefined<T> = T | undefined
export type Empty<T> = T | {}
export type KeychainType = 'auth'
export type Action<T, U = T> = { type: string; params?: T; payload?: U }

export interface AuthRequest {
  phone: string
  code?: string
  token?: string
  idToken?: string
}
export interface AuthRequestGoogle {
  auth_token?: string
}
export interface AuthRequestApple {
  user?: string
  email?: string
  first_name_apple?: string
  last_name_apple?: string
}
export interface AuthRequestYandex {
  yandex_id?: string
  email?: string
  first_name_yandex?: string
  last_name_yandex?: string
}
export interface AuthRequestTelegram {
  number?: string
  phone?: string
  code?: string
  idToken?: string
}
export interface AuthSuccessResponse {
  token?: string
}

export type GenderType = 'woman' | 'man'

export type UserProfile = {
  readonly id: number
  readonly first_name: Nullable<string>
  readonly last_name: Nullable<string>
  readonly second_name: Nullable<string>
  readonly photo_id: Nullable<number>
  readonly photo: Nullable<string>
  readonly birthday: Nullable<string>
  readonly gender: Nullable<GenderType>
  readonly confirm: boolean
  readonly email: Nullable<string>
  readonly phone: string
  readonly first_name_apple: string
  readonly first_name_yandex: string
  readonly last_name_apple: string
  readonly last_name_yandex: string
  readonly yandex_id: string
  readonly googleIdToken: string
  readonly apple_id: string
  readonly rides_as_driver: number
  readonly rides_as_passenger: number
  readonly created_at: string
}

export type UserStories = {
  readonly user_id: number
  readonly user_image: string
  readonly stories: {
    user_id: string
    url_history: string
  }[]
}[]
export interface UserProfileRequest { }
export interface UserProfileSuccessResponse {
  client: UserProfile
}
export interface UserStorySuccessResponse {
  data: {
    user_id: number
    user_image: string
    stories: {
      user_id: string
      url_history: string
    }[]
  }
}

export interface UserProfileUpdateRequest {
  isRegistration?: boolean
  first_name: string
  last_name: string
  second_name?: string
  phone: string
  gender?: GenderType
  confirm: boolean
  photo_id: Nullable<number>
  email: Nullable<string>
  birthday: string
  newPhoto?: Nullable<PickedFileType>
}

export interface TripPriceUpdateRequest {
  id: string
  rides: {
    price: number
  }[]
}
export interface TripDetailUpdateRequest {
  id: string
  request: {
    passengers: number
    car_id?: number
    animals: boolean
    baby_chair: boolean
    can_smoke: boolean
    take_delivery: boolean
    cargo: boolean
    max2seat: boolean
  }
}
export interface TripTimeUpdateRequest {
  id: string
  request: {
    date: string
    time: string
  }
}

export interface UserRegistration {
  firstName?: string
  lastName?: string
  birthDate?: string
  gender?: GenderType
  idConfirm?: boolean
  phone?: string
  email?: Nullable<string>
  uri?: Nullable<string>
}

export type PickedFileType = {
  name: string
  size: number
  type: string
  uri: string
}
export type UploadFileType = PickedFileType &
  UploadedFileType & {
    progress: number
    fetching: boolean
  }

export type UploadedFileType = {
  base_url: string
  extension: string
  filename: string
  id: number
  name: string
  original: string
  size: number
  size_unit: string
  thumbnail_url: Nullable<string>
  type: string
  url: string
}

export type NotificationType = {
  id: number
  date: string
  title: string
  message: string
  isNew: boolean
}
export interface NotificationsRequest {
  page: number
  limit?: number
  offset?: number
}
export type NotificationsSuccessResponse = {
  notifications: NotificationType[]
  page: number
  limit: number
  total: number
}
export type NotificationsReadRequest = number
export type NotificationsReadSuccessResponse = {
  notification: NotificationType
}

export interface TripsRequest {
  type: 'driver' | 'passenger'
  page: number
  limit?: number
}
export interface TripsSuccessResponse {
  rides: TripInfoType[]
  page: number
  limit: number
  total: number
}

export type TripSearch = TripSearchRequest & {
  departure: CitySuggestType
  destination: CitySuggestType
}

export type TripSearchRequest = {
  start: string
  end: string
  date: string
  cargo: number
  take_delivery: number
  max2seat: number
  animals: number
  baby_chair: number
  can_smoke: number
  order_by: TripSearchFilterSort
  time: string
  page: number
}

export type TripSearchFiltersTime = { [time: string]: number }

export type TripSearchFilterSort = 'earlier' | 'cheaper' | 'nearest_departure' | 'nearest_destination'

export interface TripsSearchResponse {
  rides: TripInfoType[]
  page: number
  limit: number
  total: number
  times: TripSearchFiltersTime
}

export interface TripSearchFiltersUpdateRequest {
  start: string
  end: string
  date: string
  cargo: number
  take_delivery: number
  max2seat: number
  animals: number
  baby_chair: number
  can_smoke: number
  order_by: TripSearchFilterSort
}
export interface TripSearchFiltersUpdateSuccessResponse {
  times: TripSearchFiltersTime
}

export interface TripsResponse {
  readonly rides: TripInfoType[]
}

export type TripStatusType = 'in_progress' | 'cancelled' | 'completed' | 'active' | 'onCreate' | 'finished'
export type TripRoleType = 'driver' | 'passenger' | 'applicant'

export type TripInfoType = {
  readonly id: number
  readonly animals: boolean
  readonly baby_chair: boolean
  readonly can_smoke: boolean
  readonly car: CarType
  readonly driver: UserProfile
  readonly comment: Nullable<string>
  readonly max2seat: boolean
  readonly passenger_payment: Nullable<PassengerPaymentType>
  readonly passengers: UserProfile[]
  readonly rides: RouteType[]
  readonly take_delivery: boolean
  readonly cargo: boolean
  status: TripStatusType
  readonly max_passengers: number
}

export type PassengerProfile = UserProfile & {}

export type TripInfoDetailRequest = {
  id: number
}

export type TripInfoDetailResponse = {
  readonly trip: TripInfoType
}

export interface TripDetailRequest {
  id: number
}

export interface TripDetailResponse {
  readonly ride: TripInfoType
}

export interface FileUploadSuccessResponse {
  file: UploadedFileType
}

export interface CityRequest {
  location: string
}

export type CarModelType = {
  readonly id: number
  readonly make: string
  readonly model: string
  readonly fullname: string
}

export type ImageType = {
  readonly id: number
  readonly url: string
  readonly thumbnail_url: string
}

export type CarType = {
  readonly id: number
  readonly car_model: CarModelType
  readonly color: CarColorType
  readonly photo: Nullable<ImageType>
  readonly year: number
  readonly number_plate?: string
}

export interface CarsRequest { }
export interface CarsSuccessResponse {
  cars: CarType[]
  limit: number
  page: number
  total: number
}

export type CarBrandType = {
  id: number
  maker: string
}
export interface CarsBrandRerquest {
  search: string
}
export interface CarsBrandSuccessResponse {
  makers: CarBrandType[]
}

export type CarModelsType = {
  id: number
  model: string
  maker: string
}

export interface CarsModelsRerquest {
  maker: string
  search: string
}
export interface CarsModelsSuccessResponse {
  models: CarModelsType[]
}

export type CarColorType = {
  id: number
  color_code: string
  label: string
}
export interface CarsColorsRerquest { }
export interface CarsColorsSuccessResponse {
  colors: CarColorType[]
}

export interface AddCarRequest {
  client_id: number
  car_model_id: number
  photo_id: number
  color_id: number
  year: number | string
  number_plate: string
}

export interface CarsAddCarRequest extends AddCarRequest {
  photo: PickedFileType
}
export interface CarsAddCarSuccessResponse { }

export interface UpdateCarRequest {
  id: number
  car_model_id: number
  photo_id: number
  color_id: number
  year: number | string
  number_plate?: string
}
export interface CarsUpdateCarRequest extends UpdateCarRequest {
  newPhoto: PickedFileType
}
export interface CarsUpdateCarSuccessResponse { }

export type IntermediateCityType = PlaceSuggestType & {
  address?: string
  datetime?: string
  waypoint?: WaypointsType
  utcOffset?: number
}

export type LocationType = {
  lat: number
  lng: number
}

export type DistanceType = {
  text: string
  value: number
}

export type DurationType = {
  text: string
  value: number
}

export interface IntermediateCalculateCity {
  id: string
  sessionToken: string
}
export interface IntermediateCalculateRequest {
  points: IntermediateCalculateCity[]
}
export interface IntermediateCalculateSuccessResponse {
  rides: WaypointsType[]
}

export type WaypointsType = {
  distance: DistanceType
  duration: DurationType
  start_address: string
  start_location: LocationType
  start_tz_offset: number
  end_address: string
  end_location: LocationType
  end_tz_offset: number
  price: number
}

export type WaypointExtendedType = {
  start: IntermediateCityType
  end: IntermediateCityType
  price: number
}

export type PlaceSuggestType = CitySuggestType & {
  sessionToken?: string
  place?: CitySuggestType
}

export type CitySuggestType = {
  id: string
  description: string
  main_text: string
  secondary_text: string
}

export type PhoneType = {
  url_logo?: string
  phone_code?: string
}

export interface PlaceRequest {
  input: string
  detail: 1 | 0
  sessionToken: string
}
export interface PlaceSuccessResponse {
  cities: CitySuggestType[]
}

export interface NewTripUpdateIntermediateRequest {
  cities: IntermediateCityType[]
}
export interface NewTripUpdateIntermediateSuccessResponse {
  cities: IntermediateCityType[]
}
export interface CarsDeleteCarRequest {
  id: number
}
export interface CarsDeleteCarSuccessResponse { }

export type PassengerPaymentType = 'cash' | 'card'

export interface NewTripDetails {
  passengers?: number
  car?: CarType
  animals?: boolean
  baby_chair?: boolean
  can_smoke?: boolean
  take_delivery?: boolean
  cargo?: boolean
  max2seat?: boolean
  passenger_payment?: Nullable<PassengerPaymentType>
  confirm_booking?: boolean
  comment?: Nullable<string>
}

export type RoutePointType = {
  id: string
  description: string
  main_text: string
  secondary_text: string
  place: Nullable<{
    id: string
    description: string
    main_text: string
    secondary_text: string
  }>
  datetime: string
  sessionToken?: string
  tz_offset: number
}

export type RouteType = {
  start: RoutePointType
  end: RoutePointType
  price: number
  passengers: RoutePassengersType[]
}

export type RoutePassengersType = {
  id: number
  count_passengers: number
  confirmed: boolean
}

export interface NewTripPublishRequest {
  rides: RouteType[]
  passengers: number
  car_id: number
  animals: boolean
  baby_chair: boolean
  can_smoke: boolean
  take_delivery: boolean
  cargo: boolean
  max2seat: boolean
  passenger_payment: PassengerPaymentType
  confirm_booking: boolean
  comment: Nullable<string>
}

export interface NewTripPublishSuccessResponse { }

export type TripFilterOrderType = 'earlier' | 'cheaper' | 'nearest_departure' | 'nearest_destination'
export type TripSearchFilterType = {
  orderBy: TripFilterOrderType
  time: Nullable<string>
  animals?: boolean
  baby_chair?: boolean
  can_smoke?: boolean
  take_delivery?: boolean
  cargo?: boolean
  max2seat?: boolean
}

export interface TripCancelBookingRequest {
  ride_id: number
}

export interface LogoutRequest {
  token: string
}
export interface TripCancelBookingSuccessResponse {
  rides: TripInfoType[]
}

export interface TripBookingRequest {
  ride_id: number
  start_city_id: string
  end_city_id: string
  passengers: number
}
export interface TripBookingSuccessResponse { }

export interface TripCancelRequest {
  ride_id: number
}
export interface TripCancelSuccessResponse {
  rides: TripInfoType[]
}

export interface CountriesRequest { }
export interface CountriesSuccessResponse {
  countries: CountryType[]
}
export type CountryType = {
  readonly id: number
  readonly name: string
  readonly code: string
  readonly image: Nullable<ImageType>
  readonly language_code: string
  readonly phone_code: string
}

export type CountryExtendedType = CountryType & {
  readonly active: number
  readonly max_points_count: number
  readonly currency_code: string
  readonly price_step: number
  readonly price_per_km: number
  documents: AgreementType[]
}

export interface CountryRequest {
  country_id: number
}
export interface CountrySuccessResponse {
  country: CountryExtendedType
}

export interface RegisterDeviceRequest {
  readonly os: string
  readonly model: string
  readonly player_id: string
  readonly app_version: string
  readonly build_number: string
}

export interface RegisterDeviceSuccess { }

export interface IntermediateTipsRequest {
  start_city_id: string
  end_city_id: string
}

export interface IntermediateTipsSuccessResponse {
  cities: CitySuggestType[]
}

export type AgreementType = {
  title: string
  type: AgreementTypesType
  content: string
}
export type DocumentType = {
  title: string
  type?: AgreementTypesType
  content?: string
}

export interface logoutResponse {
  succes: true
}

export type AgreementTypesType = 'privacy_policy' | 'personal_data' | 'terms_of_use' | 'other'
