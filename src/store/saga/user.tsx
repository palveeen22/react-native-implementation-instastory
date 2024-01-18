import { put, call, delay, select } from 'redux-saga/effects'
import {
  Action,
  ApiErrorResponse,
  ApiResponse,
  ApiType,
  FileUploadSuccessResponse,
  UserProfileRequest,
  UserProfileSuccessResponse,
  UserProfileUpdateRequest,
} from '../../types'
import { AppState } from '../redux'
import { authLogoutSuccessAction } from '../redux/auth'
import {
  userProfileDeleteFailureAction,
  userProfileDeleteSuccessAction,
  userProfileFailureAction,
  userProfileRequestAction,
  userProfileSuccessAction,
  userProfileSuccessAppleAction,
  userProfileSuccessGoogleAction,
  userProfileUpdateFailureAction,
  userProfileUpdateSuccessAction,
  userStoryFailureAction,
  userStorySuccessAction,
} from '../redux/user'
import { appStartedAction } from '../redux/_app'

const isAppStarted = (state: AppState): boolean => state._app.started

export function* userRequestGoogleSaga(api: ApiType, action: Action<UserProfileRequest>) { // userProfileGoogleRequest
  const response: ApiResponse<UserProfileSuccessResponse> = yield call(api.userProfileGoogleRequest, action.params)

  if (response.ok) {
    yield put(userProfileSuccessGoogleAction(response.data?.result))
  } else {
    yield put(userProfileFailureAction(response.data as ApiErrorResponse))
  }
  // const isStarted = yield select(isAppStarted)
  // if (!isStarted) {
  //   yield put(appStartedAction())
  // }
}
export function* userRequestAppleSaga(api: ApiType, action: Action<UserProfileRequest>) { // userProfileGoogleRequest
  const response: ApiResponse<UserProfileSuccessResponse> = yield call(api.userProfileGoogleRequest, action.params)

  if (response.ok) {
    yield put(userProfileSuccessAppleAction(response.data?.result))
  } else {
    yield put(userProfileFailureAction(response.data as ApiErrorResponse))
  }
  // const isStarted = yield select(isAppStarted)
  // if (!isStarted) {
  //   yield put(appStartedAction())
  // }
}
export function* userRequestSaga(api: ApiType, action: Action<UserProfileRequest>) {
  const response: ApiResponse<UserProfileSuccessResponse> = yield call(api.userProfileRequest, action.params)
  if (response.ok) {
    yield put(userProfileSuccessAction(response.data?.result))
  } else {
    yield put(userProfileFailureAction(response.data as ApiErrorResponse))
  }
  const isStarted = yield select(isAppStarted)
  if (!isStarted) {
    yield put(appStartedAction())
  }
}

export function* userStoriesRequestSaga(api: ApiType, action: Action<UserProfileRequest>) {
  const response: ApiResponse<UserProfileSuccessResponse> = yield call(api.userStoriesRequest, action.params)
  if (response.ok) {
    yield put(userStorySuccessAction(response?.data))
  } else {
    yield put(userStoryFailureAction(response.data as ApiErrorResponse))
  }
}

export function* userDeleteRequestSaga(api: ApiType, action: Action<null>) {
  const response: ApiResponse<null> = yield call(api.userProfileDeleteRequest)
  if (response.ok) {
    yield put(userProfileDeleteSuccessAction(response.data?.result))
    yield put(authLogoutSuccessAction())
  } else {
    yield put(userProfileDeleteFailureAction(response.data as ApiErrorResponse))
  }
}

export function* userUpdateRequestSaga(api: ApiType, action: Action<UserProfileUpdateRequest>) {
  const { photo_id, newPhoto, isRegistration = false } = action.params
  if (!photo_id && !!newPhoto) {
    const uploadPhotoResponse: ApiResponse<FileUploadSuccessResponse> = yield call(
      api.uploadUserPhoto,
      action.params.newPhoto
    )
    if (uploadPhotoResponse.ok) {
      action.params.photo_id = uploadPhotoResponse.data?.result?.file?.id
    }
    delete action.params.newPhoto
  }
  delete action.params.isRegistration

  const response: ApiResponse<UserProfileSuccessResponse> = yield call(api.userProfileUpdateRequest, action.params)

  if (response.ok) {
    if (isRegistration) {
      yield put(userProfileUpdateSuccessAction())
    } else {
      yield put(userProfileRequestAction())
    }
  } else {
    yield put(userProfileUpdateFailureAction(response.data as ApiErrorResponse))
  }
}
