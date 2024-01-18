import { NativeScrollEvent, NativeSyntheticEvent, PermissionsAndroid, Platform } from 'react-native'
import config, { StoresType } from '../config'
import {
  launchCamera,
  CameraOptions,
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker'
import moment from 'moment'
import 'moment/locale/ru'
moment().locale('ru')

import { Nullable, PickedFileType, RouteType, TripRoleType, UploadFileType, UserProfile } from '../types'
import { showMessage } from 'react-native-flash-message'

export function getStoreName() {
  const store: StoresType = Platform.OS === 'ios' ? 'app_store' : config.store
  return store
}

export function isEmailValid(email: string) {
  if (!email) {
    return true
  }

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email.toLowerCase())
}

export async function requestReadExternalStoragePermission() {
  if (Platform.OS === 'ios') {
    return true
  }
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export function getFormatedPhoneNumber(countryCode: number, value: string) {
  if (countryCode.toString().length > 2) {
    const code = value.substring(0, 2)
    const operator = `(${code}${code.length == 2 ? ') ' : ''}`
    const _number = [value.substring(2, 5), value.substring(5, 7), value.substring(7)]
    const _a = `${_number[0]}${_number[0].length == 3 ? '-' : ''}`
    const _b = `${_number[1]}${_number[1].length == 2 ? '-' : ''}`
    const number = `${_a}${_b}${_number[2]}`
    return `+${countryCode} ${operator}${number ? ` ${number}` : ''}`
  } else {
    const code = value.substring(0, 3)
    const operator = `(${code}${code.length == 3 ? ') ' : ''}`

    const _number = [value.substring(3, 6), value.substring(6, 8), value.substring(8)]
    const _a = `${_number[0]}${_number[0].length == 3 ? '-' : ''}`
    const _b = `${_number[1]}${_number[1].length == 2 ? '-' : ''}`
    const number = `${_a}${_b}${_number[2]}`
    return `+${countryCode} ${operator}${number ? ` ${number}` : ''}`
  }
}

export type FilePickerSourceType = 'gallery' | 'document' | 'camera'

type FilePickerType = {
  maxCount?: Nullable<number>
  selected?: Array<UploadFileType | PickedFileType>
  maxFileSize?: Nullable<number> // Mb !!!
  maxTotalSize?: Nullable<number> // Mb !!!
  extensions?: Nullable<Array<string>>
  source?: FilePickerSourceType
}

export async function filePicker(params: FilePickerType) {
  const { maxCount, selected = [], maxFileSize, maxTotalSize, extensions, source = 'document' } = params
  const permission = await requestReadExternalStoragePermission()
  if (permission) {
    let pickedFiles = [] as Array<PickedFileType>
    try {
      switch (source) {
        case 'camera': {
          const options: CameraOptions = {
            mediaType: 'photo',
            cameraType: 'front',
            saveToPhotos: true,
          }
          const response: ImagePickerResponse = await new Promise((resolve, reject) => {
            try {
              launchCamera(options, resolve)
            } catch (error) {
              console.log({ error })
              reject(error)
            }
          })
          if (!!response.didCancel && !!response.errorCode) {
            console.log({ response })
            break
          }
          pickedFiles = response.assets.map((file) => {
            const fileName = file.fileName || ''
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            return {
              name: `${file.width}-${file.height}-${file.fileSize}.${extension}`,
              size: file.fileSize || 0,
              type: file.type || '',
              uri: file.uri || '',
            }
          })
          break
        }
        case 'gallery': {
          const options: ImageLibraryOptions = {
            mediaType: 'photo',
          }
          const response: ImagePickerResponse = await new Promise((resolve, reject) => {
            try {
              launchImageLibrary(options, resolve)
            } catch (error) {
              console.log({ error })
              reject(error)
            }
          })
          if (!!response.didCancel && !!response.errorCode) {
            console.log({ response })
            break
          }
          pickedFiles = response.assets.map((file) => {
            const fileName = file.fileName || ''
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            return {
              name: `${file.width}-${file.height}-${file.fileSize}.${extension}`,
              size: file.fileSize || 0,
              type: file.type || '',
              uri: file.uri || '',
            }
          })

          break
        }
      }
      let errorFiles = [] as Array<PickedFileType>
      let resultFiles = [] as Array<PickedFileType>
      let size = 0

      let errorMessage = ''
      let maxFilesError = false
      let maxSizeError = false
      let totalSizeError = false

      for (const file of pickedFiles) {
        const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
        const fileSize = file.size
        const extensionOk = extensions ? extensions.includes(extension) : true
        const sizeOk = maxFileSize ? fileSize < maxFileSize * 1024 ** 2 : true
        const totalSizeOk = maxTotalSize ? size + fileSize < maxTotalSize * 1024 ** 2 : true
        const isNewFile = selected.findIndex((item) => (item as UploadFileType)?.original === file.name) == -1
        const countOk = maxCount ? resultFiles.length + selected.length < maxCount : true

        maxFilesError = !countOk || maxFilesError
        maxSizeError = !sizeOk || maxSizeError
        totalSizeError = !totalSizeOk || totalSizeError

        if (isNewFile && extensionOk && sizeOk && totalSizeOk && countOk) {
          resultFiles.push(file)
          size += fileSize
        } else {
          if (!extensionOk) {
            if (errorMessage) {
              errorMessage += `\nФайл ${file.name} не поддерживается`
            } else {
              errorMessage = `Файл ${file.name} не поддерживается`
            }
          }
          if (!isNewFile) {
            if (errorMessage) {
              errorMessage += `\nФайл ${file.name} уже добавлен`
            } else {
              errorMessage = `Файл ${file.name} уже добавлен`
            }
          }
          errorFiles.push(file)
        }
      }

      if (maxFilesError) {
        if (errorMessage) {
          errorMessage += `\nМожно прикрепить не более ${maxCount} файлов`
        } else {
          errorMessage = `Можно прикрепить не более ${maxCount} файлов`
        }
      }
      if (maxSizeError) {
        if (errorMessage) {
          errorMessage += `\nМаксимальный размер файла ${maxFileSize}Мб`
        } else {
          errorMessage = `Максимальный размер файла ${maxFileSize}Мб`
        }
      }
      if (totalSizeError) {
        if (errorMessage) {
          errorMessage += `\nОбщий размер файлов не может превышать ${maxTotalSize} файлов`
        } else {
          errorMessage = `Общий размер файлов не может превышать ${maxTotalSize}Мб`
        }
      }

      if (errorMessage) {
        showMessage({
          type: 'danger',
          message: errorMessage,
          duration: 3000,
        })
      }
      return resultFiles
    } catch (error) {
      console.log({ error })
      return []
    }
  }
  return []
}

export function capitalize(text: Nullable<string>): string {
  if (!text) {
    return ''
  }
  return text.substring(0, 1).toUpperCase() + text.substring(1)
}

export function formatTime(value: string, max: number) {
  value = value.substring(value.length - 2)
  const _value = +value
  if (!!_value && _value < 10 && _value > max / 10) {
    value = `0${_value}`
  }
  if (!!_value && _value >= max) {
    value = '00'
  }
  return value
}

export function getScrollOffset(e: NativeSyntheticEvent<NativeScrollEvent>) {
  const maxContentHeight = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height
  const scrollOffset = e.nativeEvent.contentOffset.y
  return scrollOffset <= maxContentHeight ? scrollOffset : maxContentHeight
}

export function getTabBarVisible() {
  let offset = 0
  return (scrollOffset?: number) => {
    let result = offset === 0
    if (scrollOffset !== undefined) {
      result = offset > scrollOffset || scrollOffset <= 0
      offset = scrollOffset
    }
    return result
  }
}

export function getMyRides(
  rides: RouteType[],
  profile: UserProfile,
  role: TripRoleType,
  departure_id?: string,
  destination_id?: string
) {
  return role === 'applicant'
    ? (() => {
      const departure = rides.find((ride) => ride.start.id === departure_id)?.start
      const destination = rides.find((ride) => ride.end.id === destination_id)?.end
      const depatrureRideIndex = rides?.findIndex((ride) => ride.start.id === departure?.id)
      const destinationRideIndex = rides?.findIndex((ride) => ride.end.id === destination?.id)
      return rides.filter((ride, index) => index >= depatrureRideIndex && index <= destinationRideIndex)
    })()
    : role === 'driver'
      ? rides
      : rides.filter((ride) => ride.passengers.map((passenger) => passenger.id).includes(profile.id))
}

export function mergeStyles(styles: any) {
  return Array.isArray(styles) ? styles.reduce((res, style) => ({ ...res, ...style }), {}) : styles
}

export function allBookedCount(passengersRides: Array<Array<any>>) {
  let uniqueId = []
  for (let i = 0; i < passengersRides.length; i++) {
    for (let j = 0; j < passengersRides[i].length; j++) {
      uniqueId.push(passengersRides[i][j])
    }
  }

  let passengersCount = uniqueId
    .reduce(
      (val, curr) => {
        if (val.map[curr.id]) {
          return val
        }
        val.map[curr.id] = true
        val.passengersCount.push(curr)
        return val
      },
      {
        map: {},
        passengersCount: [],
      }
    )
    .passengersCount.reduce((val, curr) => val + curr.count_passengers, 0)
  return passengersCount
}
