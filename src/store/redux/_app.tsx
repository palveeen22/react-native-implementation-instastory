import { Action } from '../../types'

export interface AppState {
  persisted: boolean
  started: boolean
}

export const APP_PERSISTED = 'APP_PERSISTED'
export const APP_STARTED = 'APP_STARTED'

export const appPersistedAction = () => ({ type: APP_PERSISTED })
export const appStartedAction = () => ({ type: APP_STARTED })

export const initialState: AppState = {
  persisted: false,
  started: false,
}

const AppReducer = (state = initialState, action: Action<any>): AppState => {
  const { type } = action

  switch (type) {
    case APP_PERSISTED: {
      return { ...state, persisted: true }
    }
    case APP_STARTED: {
      return { ...state, started: true }
    }
    default:
      return state
  }
}

export default AppReducer
