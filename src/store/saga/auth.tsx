import { put, call, select } from 'redux-saga/effects'
import { AuthSuccessResponse, Nullable, ApiResponse, Action, AuthRequest, LogoutRequest, AuthRequestGoogle, AuthRequestTelegram, AuthRequestApple, AuthRequestYandex } from '../../types'

import { authSuccessAction, authFailureAction, authSetTokenAction, authLogoutSuccessAction, authSetTokenGoogleAction, authSetTokenTelegramAction, authSetTokenGoogleCheckAction, authSetTokenAppleAction, authSetTokenAppleCheckAction, authSetTokenYandexAction } from '../redux/auth'

import { AppState } from '..'
import { userProfileRequestAction, userProfileRequestAppleAction, userProfileRequestGoogleAction } from '../redux/user'
import { notificationsRequestAction } from '../redux/notifications'
import { ApiType } from '../../types'
import { appStartedAction } from '../redux/_app'
import { ApiErrorResponse } from '../../api'
import { countriesRequestAction } from '../redux/countries'
import DeviceInfo from 'react-native-device-info'
import OneSignal from 'react-native-onesignal'

const getPushToken = () => OneSignal.getDeviceState().then((state) => state.userId)
const getToken = (state: AppState): Nullable<string> => state.auth.token
const getDeviceName = async () => await DeviceInfo.getDeviceName().then((name) => name)

export function* authRequestSaga(api: ApiType, action: Action<AuthRequest>) {
  let response: ApiResponse<AuthSuccessResponse>
  if (action.params.code) {
    response = yield call(api.authConfirmRequest, action.params)
  } else {
    response = yield call(api.authRequest, action.params)
  }

  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}
export function* authRequestGoogleCheckSaga(api: ApiType, action: Action<AuthRequest>) {
  //here
  let response: ApiResponse<AuthSuccessResponse>
  if (action.params.code) {
    response = yield call(api.authConfirmRequest, action.params)
  } else {
    response = yield call(api.authRequest, action.params)
  }

  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenGoogleCheckAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}

export function* authRequestGoogleSaga(api: ApiType, action: Action<AuthRequestGoogle>) {
  let response: ApiResponse<AuthSuccessResponse>
  if (action.params.auth_token) {
    response = yield call(api.authConfirmRequestGoogle, action.params)
  }
  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenGoogleAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}

export function* authRequestAppleCheckSaga(api: ApiType, action: Action<AuthRequest>) {
  let response: ApiResponse<AuthSuccessResponse>
  if (action.params.code) {
    response = yield call(api.authConfirmRequest, action.params)
  } else {
    response = yield call(api.authRequest, action.params)
  }

  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenAppleCheckAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}

export function* authRequestAppleSaga(api: ApiType, action: Action<AuthRequestApple>) {
  let response: ApiResponse<AuthSuccessResponse>

  if (action.params.user) {
    response = yield call(api.authConfirmRequestApple, action.params)
  }

  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenAppleAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}

export function* authRequestYandexSaga(api: ApiType, action: Action<AuthRequestYandex>) {
  let response: ApiResponse<AuthSuccessResponse>

  if (action.params.yandex_id) {
    response = yield call(api.authConfirmRequestYandex, action.params)
  }

  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenYandexAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}
export function* authRequestTelegramSaga(api: ApiType, action: Action<AuthRequestTelegram>) {
  let response: ApiResponse<AuthSuccessResponse>
  if (action.params.code) {
    // response = yield call(api.authConfirmRequest, action.params)
    response = yield call(api.authConfirmRequestTelegram, action.params)
  } else {
    response = yield call(api.authConfirmRequestTelegram, action.params)
    // response = yield call(api.authRequest, action.params)
  }
  if (response.ok) {
    if (response.data?.result?.token) {
      yield put(authSetTokenTelegramAction(response.data.result))
    } else {
      yield put(authSuccessAction())
    }
  } else {
    yield put(authFailureAction(response.data as ApiErrorResponse))
  }
}

export function* authLogoutSaga(api: ApiType, params: LogoutRequest) {
  const response = yield call(api.logout, params)
  yield put(authLogoutSuccessAction())
}

export function* authLogoutSuccessSaga(action: Action<null>) {
  yield put(countriesRequestAction())
}

// export function* authCheckCodeSaga(action: any) {
// 	const payload: AuthResponse = yield call(RozmarineApi.authCheckCodeRequest, action.params)
// 	yield put(authSetTokenAction(payload))
// 	if (payload.token) {
// 		const editableProfile: Nullable<IClientProfile> = yield select(getEditableProfile)
// 		yield put(clientEditableProfileClearAction())
// 		if (editableProfile) {
// 			const profile: ClientProfileResponse = yield call(RozmarineApi.clientProfileEditRequest, editableProfile)
// 			yield put(clientProfileSetAction(profile))
// 		} else {
// 			yield put(clientProfileGetAction())
// 			yield put(clientAddressListGetAction())
// 		}
// 	}
// }

export function* authSetTokenSaga(api: ApiType, action: Action<any>) {
  const token = yield select(getToken)
  if (token) {
    const push_token: string = yield call(getPushToken)
    const os = DeviceInfo.getSystemName()
    const brand = DeviceInfo.getBrand()
    const model = `${brand[0].toUpperCase() + brand.substring(1)} ${getDeviceName()} (${DeviceInfo.getModel()})`
    const app_version = DeviceInfo.getVersion()
    const build_number = DeviceInfo.getBuildNumber()
    yield call(api.registerDevice, {
      player_id: push_token || null,
      os,
      model,
      app_version,
      build_number,
    })
    yield put(userProfileRequestAction())
    // yield put(notificationsRequestAction({ page: 1 }))
  } else {
    yield put(appStartedAction())
  }
}

export function* authSetTokenGoogleCheckSaga(api: ApiType, action: Action<any>) {
  const token = yield select(getToken)
  if (token) {
    const push_token: string = yield call(getPushToken)
    const os = DeviceInfo.getSystemName()
    const brand = DeviceInfo.getBrand()
    const model = `${brand[0].toUpperCase() + brand.substring(1)} ${getDeviceName()} (${DeviceInfo.getModel()})`
    const app_version = DeviceInfo.getVersion()
    const build_number = DeviceInfo.getBuildNumber()
    yield call(api.registerDevice, {
      player_id: push_token || null,
      os,
      model,
      app_version,
      build_number,
    })
    yield put(userProfileRequestGoogleAction())
    // yield put(notificationsRequestAction({ page: 1 }))
  } else {
    yield put(appStartedAction())
  }
}
export function* authSetTokenAppleCheckSaga(api: ApiType, action: Action<any>) {
  const token = yield select(getToken)
  if (token) {
    const push_token: string = yield call(getPushToken)
    const os = DeviceInfo.getSystemName()
    const brand = DeviceInfo.getBrand()
    const model = `${brand[0].toUpperCase() + brand.substring(1)} ${getDeviceName()} (${DeviceInfo.getModel()})`
    const app_version = DeviceInfo.getVersion()
    const build_number = DeviceInfo.getBuildNumber()
    yield call(api.registerDevice, {
      player_id: push_token || null,
      os,
      model,
      app_version,
      build_number,
    })
    yield put(userProfileRequestAppleAction())
    // yield put(notificationsRequestAction({ page: 1 }))
  } else {
    yield put(appStartedAction())
  }
}
export function* authSetTokenGoogleSaga(api: ApiType, action: Action<any>) {
  const token = yield select(getToken)

  if (token) {
    const push_token: string = yield call(getPushToken)
    const os = DeviceInfo.getSystemName()
    const brand = DeviceInfo.getBrand()
    const model = `${brand[0].toUpperCase() + brand.substring(1)} ${getDeviceName()} (${DeviceInfo.getModel()})`
    const app_version = DeviceInfo.getVersion()
    const build_number = DeviceInfo.getBuildNumber()
    yield call(api.registerDevice, {
      player_id: push_token || null,
      os,
      model,
      app_version,
      build_number,
    })
    yield put(userProfileRequestAction())
    // yield put(notificationsRequestAction({ page: 1 }))
  } else {
    yield put(appStartedAction())
  }
}

export function* authSetTokenTelegramSaga(api: ApiType, action: Action<any>) {
  const token = yield select(getToken)

  if (token) {
    const push_token: string = yield call(getPushToken)
    const os = DeviceInfo.getSystemName()
    const brand = DeviceInfo.getBrand()
    const model = `${brand[0].toUpperCase() + brand.substring(1)} ${getDeviceName()} (${DeviceInfo.getModel()})`
    const app_version = DeviceInfo.getVersion()
    const build_number = DeviceInfo.getBuildNumber()
    yield call(api.registerDevice, {
      player_id: push_token || null,
      os,
      model,
      app_version,
      build_number,
    })
    yield put(userProfileRequestAction())
    // yield put(notificationsRequestAction({ page: 1 }))
  } else {
    yield put(appStartedAction())
  }
}
