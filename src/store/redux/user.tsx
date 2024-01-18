import {
  ApiFailure,
  ApiErrorResponse,
  UserProfileSuccessResponse,
  UserProfile,
  Nullable,
  Action,
  UserProfileUpdateRequest,
  UserRegistration,
  UserStorySuccessResponse,
  UserStories,
} from '../../types'
import { AUTH_LOGOUT_SUCCESS } from './auth'

export interface UserState {
  registration: Nullable<UserRegistration>
  profile: Nullable<UserProfile>
  stories: Nullable<UserStories>
  profile_registration_google: Nullable<UserProfile>
  profile_registration_apple: Nullable<UserProfile>
  hasProfile: boolean
  fetching: boolean
  error: Nullable<ApiFailure>
}

export const USER_STORIES = 'USER_STORIES'
export const USER_STORIES_SUCCESS = 'USER_STORIES_SUCCESS'
export const USER_STORIES_FAILURE = 'USER_STORIES_FAILURE'

export const USER_PROFILE_REQUEST = 'USER_PROFILE_REQUEST'
export const USER_PROFILE_SUCCESS = 'USER_PROFILE_SUCCESS'
export const USER_PROFILE_FAILURE = 'USER_PROFILE_FAILURE'
export const USER_PROFILE_GOOGLE_REQUEST = 'USER_PROFILE_GOOGLE_REQUEST'
export const USER_PROFILE_APPLE_REQUEST = 'USER_PROFILE_APPLE_REQUEST'
export const USER_PROFILE_GOOGLE_SUCCESS = 'USER_PROFILE_GOOGLE_SUCCESS'
export const USER_PROFILE_APPLE_SUCCESS = 'USER_PROFILE_APPLE_SUCCESS'

export const USER_PROFILE_UPDATE_REQUEST = 'USER_PROFILE_UPDATE_REQUEST'
export const USER_PROFILE_UPDATE_SUCCESS = 'USER_PROFILE_UPDATE_SUCCESS'
export const USER_PROFILE_UPDATE_FAILURE = 'USER_PROFILE_UPDATE_FAILURE'
export const USER_PROFILE_REGISTER_UPDATE = 'USER_PROFILE_REGISTER_UPDATE'

export const USER_PROFILE_DELETE_REQUEST = 'USER_PROFILE_DELETE_REQUEST'
export const USER_PROFILE_DELETE_SUCCESS = 'USER_PROFILE_DELETE_SUCCESS'
export const USER_PROFILE_DELETE_FAILURE = 'USER_PROFILE_DELETE_FAILURE'

export const userProfileRequestAction = () => ({ type: USER_PROFILE_REQUEST })
export const userStories = () => ({ type: USER_STORIES })
export const userProfileRequestGoogleAction = () => ({ type: USER_PROFILE_GOOGLE_REQUEST })
export const userProfileRequestAppleAction = () => ({ type: USER_PROFILE_APPLE_REQUEST })
export const userProfileSuccessAction = (payload: UserProfileSuccessResponse) => ({
  type: USER_PROFILE_SUCCESS,
  payload,
})

export const userStorySuccessAction = (payload: UserProfileSuccessResponse) => ({
  type: USER_STORIES_SUCCESS,
  payload,
})
export const userProfileSuccessGoogleAction = (payload: UserProfileSuccessResponse) => ({
  type: USER_PROFILE_GOOGLE_SUCCESS,
  payload,
})
export const userProfileSuccessAppleAction = (payload: UserProfileSuccessResponse) => ({
  type: USER_PROFILE_APPLE_SUCCESS,
  payload,
})
export const userProfileFailureAction = (payload: ApiErrorResponse) => ({
  type: USER_PROFILE_FAILURE,
  payload,
})
export const userStoryFailureAction = (payload: ApiErrorResponse) => ({
  type: USER_STORIES_FAILURE,
  payload,
})
export const userProfileUpdateAction = (params: UserProfileUpdateRequest) => ({
  type: USER_PROFILE_UPDATE_REQUEST,
  params,
})
export const userProfileUpdateSuccessAction = () => ({
  type: USER_PROFILE_UPDATE_SUCCESS,
})
export const userProfileUpdateFailureAction = (payload: ApiErrorResponse) => ({
  type: USER_PROFILE_UPDATE_FAILURE,
  payload,
})
export const userProfileRegisterUpdateAction = (params: UserRegistration) => ({
  type: USER_PROFILE_REGISTER_UPDATE,
  params,
})
export const userProfileDeleteRequestAction = () => ({
  type: USER_PROFILE_DELETE_REQUEST,
})
export const userProfileDeleteSuccessAction = (payload: UserProfileSuccessResponse) => ({
  type: USER_PROFILE_DELETE_SUCCESS,
  payload,
})
export const userProfileDeleteFailureAction = (payload: ApiErrorResponse) => ({
  type: USER_PROFILE_DELETE_FAILURE,
  payload,
})

export const initialState: UserState = {
  registration: null,
  profile: null,
  stories: null,
  profile_registration_google: null,
  profile_registration_apple: null,
  hasProfile: null,
  fetching: false,
  error: null,
}

const UserReducer = (state = initialState, action: Action<any>): UserState => {
  const { type, payload, params } = action
  switch (type) {
    case USER_PROFILE_UPDATE_REQUEST:
    case USER_STORIES:
    case USER_PROFILE_REQUEST:
    case USER_PROFILE_DELETE_REQUEST: {
      return { ...state, error: null, fetching: true }
    }
    case USER_PROFILE_UPDATE_SUCCESS: {
      return { ...state, fetching: false }
    }
    case USER_PROFILE_GOOGLE_SUCCESS: {
      const { client } = (payload as UserProfileSuccessResponse) || {}
      return {
        ...state,
        fetching: false,
        hasProfile: client.first_name ? true : false,
        profile_registration_google: client,
      }
    }
    case USER_PROFILE_APPLE_SUCCESS: {
      const { client } = (payload as UserProfileSuccessResponse) || {}
      return {
        ...state,
        fetching: false,
        hasProfile: client.first_name ? true : false,
        profile_registration_apple: client,
      }
    }
    case USER_PROFILE_SUCCESS:
    case USER_PROFILE_DELETE_SUCCESS: {
      const { client } = (payload as UserProfileSuccessResponse) || {}
      return { ...state, fetching: false, profile: client }
    }
    case USER_STORIES_SUCCESS: {
      const { data } = (payload as UserStorySuccessResponse) || []
      return { ...state, fetching: false, stories: data }
    }
    case USER_PROFILE_UPDATE_FAILURE:
    case USER_PROFILE_FAILURE:
    case USER_PROFILE_DELETE_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, fetching: false, error }
    }
    case USER_PROFILE_REGISTER_UPDATE: {
      const registration = { ...(state.registration || {}) }
      return { ...state, registration: { ...registration, ...action.params } }
    }
    case AUTH_LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default UserReducer
