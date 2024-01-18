import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-async-storage/async-storage'

import _AppReducer from '../redux/_app'
import AppReducer from '../redux/app'
import rootSaga from '../saga'
import AuthReducer from './auth'
import NotificationsReducer from './notifications'
import UserReducer from './user'
import TripReducer from './trip'
import CarsReducer from './cars'
import NewTripReducer from './newTrip'
import CountriesReducer from './countries'

const rootReducer = combineReducers({
  _app: _AppReducer,
  app: AppReducer,
  auth: AuthReducer,
  notifications: NotificationsReducer,
  user: UserReducer,
  trip: TripReducer,
  cars: CarsReducer,
  newTrip: NewTripReducer,
  countries: CountriesReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['_app', 'auth', 'user', 'notifications', 'trip', 'newTrip'],
}

const composeEnhancers = composeWithDevTools({})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const sagaMiddleware = createSagaMiddleware()

const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))

const persistor = persistStore(store, null, () => {
  store.getState()
})

sagaMiddleware.run(rootSaga)

export type AppState = ReturnType<typeof rootReducer>

export { persistor, store, storage }
