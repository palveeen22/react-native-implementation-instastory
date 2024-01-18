import { put, call, delay, select } from 'redux-saga/effects'
import {
  Action,
  ApiErrorResponse,
  ApiType,
  ApiResponse,
  CarsColorsRerquest,
  CarsColorsSuccessResponse,
  CarsRequest,
  CarsSuccessResponse,
  CarsAddCarRequest,
  CarsAddCarSuccessResponse,
  AddCarRequest,
  FileUploadSuccessResponse,
  CarsUpdateCarRequest,
  CarsUpdateCarSuccessResponse,
  CarsDeleteCarRequest,
  CarsDeleteCarSuccessResponse,
} from '../../types'
import {
  carsAddCarFailureAction,
  carsAddCarSuccessAction,
  carsColorsFailureAction,
  carsColorsSuccessAction,
  carsDeleteCarFailureAction,
  carsDeleteCarSuccessAction,
  carsFailureAction,
  carsRequestAction,
  carsSuccessAction,
  carsUpdateCarFailureAction,
  carsUpdateCarSuccessAction,
} from '../redux/cars'

export function* carsRequestSaga(api: ApiType, action: Action<CarsRequest>) {
  const response: ApiResponse<CarsSuccessResponse> = yield call(api.getCars, action.params)
  if (response.ok) {
    yield put(carsSuccessAction(response.data.result))
  } else {
    yield put(carsFailureAction(response.data as ApiErrorResponse))
  }
}

export function* carsColorsRequestSaga(api: ApiType, action: Action<CarsColorsRerquest>) {
  const response: ApiResponse<CarsColorsSuccessResponse> = yield call(api.getCarColors, action.params)
  if (response.ok) {
    yield put(carsColorsSuccessAction(response.data.result))
  } else {
    yield put(carsColorsFailureAction(response.data as ApiErrorResponse))
  }
}

export function* carsAddCarRequestSaga(api: ApiType, action: Action<CarsAddCarRequest>) {
  let photo_id
  const { client_id, car_model_id, color_id, year, photo, number_plate } = action.params
  if (photo) {
    const uploadPhoto: ApiResponse<FileUploadSuccessResponse> = yield call(api.uploadCarPhoto, photo)
    if (uploadPhoto.ok) {
      photo_id = uploadPhoto.data.result.file.id
    } else {
      yield put(carsAddCarFailureAction(uploadPhoto.data as ApiErrorResponse))
    }
  }
  const requestParams: AddCarRequest = {
    client_id,
    car_model_id,
    photo_id,
    color_id,
    year,
    number_plate,
  }
  const response: ApiResponse<CarsAddCarSuccessResponse> = yield call(api.addCarRequest, requestParams)
  if (response.ok) {
    yield put(carsAddCarSuccessAction(response.data.result))
    yield put(carsRequestAction())
  } else {
    yield put(carsAddCarFailureAction(response.data as ApiErrorResponse))
  }
}

export function* carsUpdateCarRequestSaga(api: ApiType, action: Action<CarsUpdateCarRequest>) {
  const { photo_id, newPhoto } = action.params
  if (!photo_id && !!newPhoto) {
    const uploadPhotoResponse: ApiResponse<FileUploadSuccessResponse> = yield call(
      api.uploadCarPhoto,
      action.params.newPhoto
    )
    if (uploadPhotoResponse.ok) {
      action.params.photo_id = uploadPhotoResponse.data.result.file.id
    }
    delete action.params.newPhoto
  }
  const response: ApiResponse<CarsUpdateCarSuccessResponse> = yield call(api.updateCarRequest, action.params)
  if (response.ok) {
    yield put(carsRequestAction())
    yield put(carsUpdateCarSuccessAction(response.data.result))
  } else {
    yield put(carsUpdateCarFailureAction(response.data as ApiErrorResponse))
  }
}

export function* carsDeleteRequestSaga(api: ApiType, action: Action<CarsDeleteCarRequest>) {
  const response: ApiResponse<CarsDeleteCarSuccessResponse> = yield call(api.deleteCarRequest, action.params)
  if (response.ok) {
    yield put(carsRequestAction())
    yield put(carsDeleteCarSuccessAction(response.data.result))
  } else {
    yield put(carsDeleteCarFailureAction(response.data as ApiErrorResponse))
  }
}
