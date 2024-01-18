import {
  ApiErrorResponse,
  NotificationsSuccessResponse,
  ApiFailure,
  NotificationsReadSuccessResponse,
  NotificationType,
  Nullable,
  Action,
  NotificationsRequest,
  NotificationsReadRequest,
} from '../../types'
import { AUTH_LOGOUT_SUCCESS } from './auth'

export interface NotificationsState {
  notifications: Nullable<NotificationType[]>
  fetching: boolean
  error: Nullable<ApiFailure>
  page: Nullable<number>
  limit: Nullable<number>
  total: Nullable<number>
  read_fetching: boolean
  read_error: Nullable<ApiFailure>
}

export const NOTIFICATIONS_REQUEST = 'NOTIFICATIONS_REQUEST'
export const NOTIFICATIONS_SUCCESS = 'NOTIFICATIONS_SUCCESS'
export const NOTIFICATIONS_FAILURE = 'NOTIFICATIONS_FAILURE'
export const NOTIFICATIONS_READ_REQUEST = 'NOTIFICATIONS_READ_REQUEST'
export const NOTIFICATIONS_READ_SUCCESS = 'NOTIFICATIONS_READ_SUCCESS'
export const NOTIFICATIONS_READ_FAILURE = 'NOTIFICATIONS_READ_FAILURE'

export const notificationsRequestAction = (params: NotificationsRequest) => ({
  type: NOTIFICATIONS_REQUEST,
  params,
})
export const notificationsSuccessAction = (payload: NotificationsSuccessResponse) => ({
  type: NOTIFICATIONS_SUCCESS,
  payload,
})
export const notificationsFailureAction = (payload: ApiErrorResponse) => ({
  type: NOTIFICATIONS_FAILURE,
  payload,
})
export const notificationsReadRequestAction = (params: NotificationsReadRequest) => ({
  type: NOTIFICATIONS_READ_REQUEST,
  params,
})
export const notificationsReadSuccessAction = (payload: NotificationsReadSuccessResponse) => ({
  type: NOTIFICATIONS_READ_SUCCESS,
  payload,
})
export const notificationsReadFailureAction = (payload: ApiErrorResponse) => ({
  type: NOTIFICATIONS_READ_FAILURE,
  payload,
})

export const initialState: NotificationsState = {
  notifications: null,
  fetching: false,
  error: null,
  page: null,
  limit: null,
  total: null,
  read_fetching: null,
  read_error: null,
}

const NotificationsReducer = (state = initialState, action: Action<any>): NotificationsState => {
  const { type, payload, params } = action
  switch (type) {
    case NOTIFICATIONS_REQUEST: {
      return { ...state, error: null, fetching: true }
    }
    case NOTIFICATIONS_SUCCESS: {
      const { notifications, page, limit, total } = payload as NotificationsSuccessResponse
      const _notifications = page == 1 ? notifications : [...(state.notifications || []), ...notifications]
      return {
        ...state,
        fetching: false,
        notifications: _notifications,
        page,
        limit,
        total,
      }
    }
    case NOTIFICATIONS_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, fetching: false, error }
    }
    case NOTIFICATIONS_READ_REQUEST: {
      return { ...state, read_fetching: true }
    }
    case NOTIFICATIONS_READ_SUCCESS: {
      const { notification } = payload as NotificationsReadSuccessResponse
      const notifications = [...state.notifications]
      const index = notifications.findIndex((item) => item.id == notification.id)
      notifications[index] = notification
      return { ...state, read_fetching: false, notifications }
    }
    case NOTIFICATIONS_READ_FAILURE: {
      const { error } = payload as ApiErrorResponse
      return { ...state, read_fetching: false, read_error: error }
    }
    case AUTH_LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default NotificationsReducer
