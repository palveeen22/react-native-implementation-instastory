import { ApiSuccessResponse } from '../api'
import {
  AuthRequest,
  AuthSuccessResponse,
  NotificationsReadRequest,
  NotificationsReadSuccessResponse,
  NotificationsRequest,
  NotificationsSuccessResponse,
  UserProfileRequest,
  UserProfileSuccessResponse,
} from '../types'

export default {
  authRequest: (params: AuthRequest) =>
    new Promise((resolve) => {
      const data: AuthSuccessResponse = require('./authRequest.json')
      resolve({ ok: true, data })
    }),
  authConfirmRequest: (params: AuthRequest) =>
    new Promise((resolve) => {
      const data: AuthSuccessResponse = require('./authConfirmRequest.json')
      resolve({ ok: true, data })
    }),
  userProfileRequest: (params: UserProfileRequest) =>
    new Promise((resolve) => {
      const data: UserProfileSuccessResponse = require('./userProfileRequest.json')
      resolve({ ok: true, data })
    }),
  notificationsRequest: (params: NotificationsRequest) =>
    new Promise((resolve) => {
      const data: NotificationsSuccessResponse = require('./notificationsRequest.json')
      resolve({ ok: true, data })
    }),
  notificationsReadRequest: (params: NotificationsReadRequest) =>
    new Promise((resolve) => {
      const notifications: NotificationsSuccessResponse = require('./notificationsRequest.json')
      const notification = notifications.notifications.find((item) => item.id === params)
      notification.isNew = false
      resolve({ ok: true, data: { notification } })
    }),
  userProfileUpdateRequest: () =>
    new Promise((resolve) => {
      resolve({ ok: true, data: null })
    }),
  uploadUserPhoto: () =>
    new Promise((resolve) => {
      resolve({ ok: true, data: null })
    }),
}
