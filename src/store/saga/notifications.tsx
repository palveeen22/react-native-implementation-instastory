import moment from 'moment'
import { put, call, delay, select } from 'redux-saga/effects'
import {
  Action,
  ApiFailureResponse,
  NotificationsRequest,
  NotificationsSuccessResponse,
  NotificationsReadSuccessResponse,
  ApiResponse,
  NotificationsReadRequest,
  ApiType,
  ApiErrorResponse,
  NotificationType,
} from '../../types'
import {
  notificationsFailureAction,
  notificationsReadFailureAction,
  notificationsReadSuccessAction,
  notificationsSuccessAction,
} from '../redux/notifications'

const notifications: NotificationType[] = [
  {
    id: 1,
    date: moment().format('YYYY-MM-DD H:mm'),
    title: 'Новое уведомление',
    message: 'Содержимое нового уведомления',
    isNew: true,
  },
  {
    id: 2,
    date: moment().add(-5, 'days').format('YYYY-MM-DD H:mm'),
    title: 'Прочитанное уведомление',
    message: 'Содержимое прочитанного уведомления',
    isNew: false,
  },
  {
    id: 2,
    date: moment().add(-5, 'days').format('YYYY-MM-DD H:mm'),
    title: 'Длинное уведомление',
    message:
      'Содержимое длинного уведомления, Содержимое длинного уведомления, Содержимое длинного уведомления, Содержимое длинного уведомления, Содержимое длинного уведомления',
    isNew: false,
  },
]

export function* notificationsRequestSaga(api: ApiType, action: Action<NotificationsRequest>) {
  yield delay(200)
  yield put(
    notificationsSuccessAction({
      notifications,
      page: 1,
      limit: 10,
      total: 3,
    })
  )
  // const response: ApiResponse<NotificationsSuccessResponse> = yield call(api.notificationsRequest, action.params)
  // if (response.ok) {
  // 	yield put(notificationsSuccessAction(response.data.result))
  // } else {
  // 	yield put(notificationsFailureAction(response.data as ApiErrorResponse))
  // }
}

export function* notificationsReadRequestSaga(api: ApiType, action: Action<NotificationsReadRequest>) {
  const response: ApiResponse<NotificationsReadSuccessResponse> = yield call(
    api.notificationsReadRequest,
    action.params
  )
  if (response.ok) {
    yield put(notificationsReadSuccessAction(response.data.result))
  } else {
    yield put(notificationsReadFailureAction(response.data as ApiErrorResponse))
  }
}
