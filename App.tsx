import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { store, persistor } from './src/store'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Navigation from './src/navigation'
import { LogBox, Platform } from 'react-native'
import OneSignal from 'react-native-onesignal'
import config from './src/config'
import FlashMessage from 'react-native-flash-message'
import { notificationsRequestAction } from './src/store/redux/notifications'
import Orientation from 'react-native-orientation-locker'
import SplashScreen from './SplashScreen'
import AppMetrica from 'react-native-appmetrica'

AppMetrica.activate({
  apiKey: 'b92d466f-37cd-496f-b754-9db0f8c67948',
  sessionTimeout: 120,
  firstActivationAsUpdate: false,
})

LogBox.ignoreAllLogs(true)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appReady: false,
    }
  }

  componentDidMount(): void {
    Orientation.lockToPortrait()
  }

  render() {
    const { appReady } = this.state

    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PushListener />
            {!appReady ? (
              <SplashScreen
                stopAnimation={(e: boolean) => {
                  this.setState({ appReady: e })
                }}
              />
            ) : (
              <Navigation />
            )}
          </PersistGate>
          <FlashMessage position='top' floating />
        </Provider>
      </>
    )
  }
}

export default App

function PushListener() {
  const dispatch = useDispatch()

  //OneSignal Init Code
  OneSignal.setLogLevel(6, 0)
  OneSignal.setAppId(config.oneSignalAppID)
  //END OneSignal Init Code

  //Prompt for push on iOS
  Platform.OS == 'ios' &&
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      console.log('Prompt response:', response)
    })

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
    dispatch(notificationsRequestAction({ page: 1 }))
    console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent)
    let notification = notificationReceivedEvent.getNotification()
    console.log('notification: ', notification)
    const data = notification.additionalData
    console.log('additionalData: ', data)
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification)
  })

  return null
}
