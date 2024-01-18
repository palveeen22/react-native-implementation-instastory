import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Linking, useColorScheme, View, AppState as RNAppState, SafeAreaView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinkingOptions, NavigationContainer, useTheme, useIsFocused } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import {
  AuthScreen,
  ProfileScreen,
  NotificationsScreen,
  CodeConfirmScreen,
  RadioScreen,
  NewTripScreen,
  NewTripPublishScreen,
  ProfileEditScreen,
  MyTripsScreen,
  SearchTripScreen,
  SearchTripResultsScreen,
  TripDetailScreen,
  NotificationSettingsScreen,
  NewTripDetailScreen,
  NewTripIntermediateCitiesScreen,
  NewTripIntermediatePriceScreen,
  SearchTripFilterScreen,
  PublicProfileViewScreen,
  AgreementsScreen,
  AgreementScreen,
} from './screens'

import { AppState } from './store'
import { useDispatch, useSelector } from 'react-redux'
import Icon, { IconsType } from './components/Icon'
import OneSignal from 'react-native-onesignal'
import { Alert, Badge } from './components'
import BottomTab from './navigation/BottomTab'
import ThemesList from './theme'
import { StyleSheet } from 'react-native'
// import SplashScreen from 'react-native-splash-screen'
import { Route, RouteData } from './types'
import { newTripCleanAction } from './store/redux/newTrip'
// import PhoneConfirmScreen from './screens/PhoneConfirmScreen'
import PhoneConfirmScreen from './screens/PhoneConfirmScreenFC'
import {
  MainStackProps,
  AuthStackProps,
  NewTripStackProps,
  RegistrationStackProps,
  RadioStackProps,
  MyTripsStackProps,
  SearchTripStackProps,
  ProfileStackProps,
} from './navigation/types'
import CarEditScreen from './screens/CarEditScreen'
import NewTripIntermediateTimeDateScreen from './screens/NewTripIntermediateTimeDateScreen'
import NewTripIntermediateEditCitiesScreen from './screens/NewTripIntermediateEditCitiesScreen'
import DocumentsScreen from './screens/DocumentsScreen'
import PassportScreen from './screens/PassportScreen'

const RootNavigator = createStackNavigator()
const RootMainNavigator = createBottomTabNavigator()
const AuthNavigator = createStackNavigator()
const RegistrationNavigator = createStackNavigator()
const MainNavigator = createBottomTabNavigator()
const RadioNavigator = createStackNavigator()
const NewTripNavigator = createStackNavigator()
const MyTripNavigator = createStackNavigator()
const SearchTripNavigator = createStackNavigator()
const ProfileNavigator = createStackNavigator()

const TAB_BAR_ROUTES: string[] = [
  // "main",
  // "RadioStack",
  // "RadioScreen",
  // "NewTripStack",
  // "NewTripScreen",
  // "MyTripsStack",
  // "MyTripsScreen",
  // "SearchTripStack",
  // "SearchTripScreen",
  'TripDetailScreen',
  'AgreementScreen',
  'ProfileEditScreen',
  'NewTripIntermediateCitiesScreen',
]

const MainStack = ({ navigation, route }: MainStackProps) => {
  const [showBottomButton, setShowBottomButton] = useState<string>('')
  // const tabBarVisible = TAB_BAR_ROUTES.includes(routeData.screenName)
  const routeData: RouteData = getRouteData(route)
  const { colors } = useTheme()

  const dispatch = useDispatch()

  const tabBarVisible = useMemo(() => {
    return TAB_BAR_ROUTES.includes(showBottomButton)
  }, [showBottomButton])

  const ShowingBar = !tabBarVisible && routeData.showTabBar

  return (
    <MainNavigator.Navigator
      initialRouteName='SearchTripStack'
      tabBar={(props: Object) => {
        return (
          <View style={[styles.shadow, { shadowColor: colors.shadow }]}>
            <BottomTab
              props={{
                ...props,
                activeTintColor: colors.tabBar.activeTintColor,
                inactiveTintColor: colors.tabBar.inactiveTintColor,
                inactiveBackgroundColor: colors.tabBar.inactiveBackgroundColor,
                activeBackgroundColor: colors.tabBar.activeBackgroundColor,
              }}
            />
          </View>
        )
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <MainNavigator.Screen
        name="RadioStack"
        component={RadioStack}
        options={{
          tabBarIcon: ({ color }) => getIcon('radio', color),
          unmountOnBlur: true,
        }}
        listeners={({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) })}
      /> */}
      <MainNavigator.Screen
        name='SearchTripStack'
        component={SearchTripStack}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => getIcon('search', color),
          tabBarVisible: ShowingBar,
        })}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <MainNavigator.Screen
        name='MyTripsStack'
        component={MyTripsStack}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => getIcon('menu', color),
          unmountOnBlur: true,
          tabBarVisible: ShowingBar,
        })}
        initialParams={{ screenName: (arg: string) => setShowBottomButton(arg) }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <MainNavigator.Screen
        name='NewTripStack'
        component={NewTripStack}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => getIcon('add', color),
          unmountOnBlur: true,
          tabBarVisible: ShowingBar,
        })}
        initialParams={{ screenName: (arg: string) => setShowBottomButton(arg) }} // Pass the custom prop using initialParams
        listeners={({ navigation }) => ({
          blur: () => {
            navigation.setParams({ screen: undefined })
            dispatch(newTripCleanAction())
          },
        })}
      />
      <MainNavigator.Screen
        name='ProfileStack'
        component={ProfileStack}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => getIcon('user', color),
          unmountOnBlur: true,
          tabBarVisible: ShowingBar,
        })}
        initialParams={{ screenName: (arg: string) => setShowBottomButton(arg) }} // Pass the custom prop using initialParams
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
    </MainNavigator.Navigator>
  )
}

const AuthStack = ({ navigation }: AuthStackProps) => {
  const { colors } = useTheme()
  return (
    <AuthNavigator.Navigator headerMode='none' initialRouteName={'AuthScreen'}>
      <AuthNavigator.Screen name='AuthScreen' component={AuthScreen} initialParams={{ colors }} />
      <AuthNavigator.Screen name='PhoneConfirmScreen' component={PhoneConfirmScreen} initialParams={{ colors }} />
      <AuthNavigator.Screen name='CodeConfirmScreen' component={CodeConfirmScreen} initialParams={{ colors }} />
    </AuthNavigator.Navigator>
  )
}

const RegistrationStack = ({ navigation, route }: RegistrationStackProps) => {
  const { colors } = useTheme()

  return (
    <RegistrationNavigator.Navigator headerMode='none' initialRouteName={'ProfileEditScreen'}>
      <RegistrationNavigator.Screen
        name='ProfileEditScreen'
        component={ProfileEditScreen}
        initialParams={{
          colors,
          registration: true,
          screenName: (arg: string) => console.log(arg),
        }}
      />
      <RegistrationNavigator.Screen
        name='CarEditScreen'
        component={CarEditScreen}
        initialParams={{
          colors,
        }}
      />
    </RegistrationNavigator.Navigator>
  )
}

const RadioStack = ({ navigation }: RadioStackProps) => {
  const { colors } = useTheme()
  return (
    <RadioNavigator.Navigator headerMode='none' initialRouteName={'RadioScreen'}>
      <RadioNavigator.Screen name='RadioScreen' component={RadioScreen} initialParams={{ colors }} />
    </RadioNavigator.Navigator>
  )
}

const NewTripStack = ({ navigation, route }: NewTripStackProps) => {
  const { colors } = useTheme()
  const screenName = route.params?.screenName

  return (
    <NewTripNavigator.Navigator headerMode='none' initialRouteName={'NewTripScreen'}>
      <NewTripNavigator.Screen name='NewTripScreen' component={NewTripScreen} initialParams={{ colors }} />
      <NewTripNavigator.Screen
        name='NewTripIntermediateCitiesScreen'
        component={NewTripIntermediateCitiesScreen}
        initialParams={{
          colors,
          screenName: (arg: string) => screenName(arg),
        }}
      />
      <NewTripNavigator.Screen
        name='NewTripIntermediatePriceScreen'
        component={NewTripIntermediatePriceScreen}
        initialParams={{ colors }}
      />
      <NewTripNavigator.Screen name='NewTripDetailScreen' component={NewTripDetailScreen} initialParams={{ colors }} />
      <NewTripNavigator.Screen name='CarEditScreen' component={CarEditScreen} initialParams={{ colors }} />
      <NewTripNavigator.Screen
        name='NewTripPublishScreen'
        component={NewTripPublishScreen}
        initialParams={{ colors }}
      />
    </NewTripNavigator.Navigator>
  )
}

const MyTripsStack = ({ navigation, route }: MyTripsStackProps) => {
  const { colors } = useTheme()
  const screenName = route.params?.screenName
  return (
    <MyTripNavigator.Navigator headerMode='none' initialRouteName={'MyTripsScreen'}>
      <MyTripNavigator.Screen name='MyTripsScreen' component={MyTripsScreen} initialParams={{ colors }} />
      <MyTripNavigator.Screen
        name='EditRouteScreen'
        component={NewTripIntermediateEditCitiesScreen}
        initialParams={{ colors }}
      />
      <MyTripNavigator.Screen
        name='TimeDateScreen'
        component={NewTripIntermediateTimeDateScreen}
        initialParams={{ colors }}
      />
      <MyTripNavigator.Screen
        name='TripDetailScreen'
        component={TripDetailScreen}
        initialParams={{
          colors,
          screenName: (arg: string) => screenName(arg),
        }}
      />
      <MyTripNavigator.Screen
        name='PublicProfileViewScreen'
        component={PublicProfileViewScreen}
        initialParams={{
          colors,
          screenName: (arg: string) => screenName(arg),
        }}
      />
    </MyTripNavigator.Navigator>
  )
}

const SearchTripStack = ({ navigation }: SearchTripStackProps) => {
  const { colors } = useTheme()
  return (
    <SearchTripNavigator.Navigator headerMode='none' initialRouteName={'SearchTripScreen'}>
      <SearchTripNavigator.Screen name='SearchTripScreen' component={SearchTripScreen} initialParams={{ colors }} />
      <SearchTripNavigator.Screen
        name='SearchTripResultsScreen'
        component={SearchTripResultsScreen}
        initialParams={{ colors }}
      />
      <SearchTripNavigator.Screen
        name='SearchTripFilterScreen'
        component={SearchTripFilterScreen}
        initialParams={{ colors }}
      />
    </SearchTripNavigator.Navigator>
  )
}

const ProfileStack = ({ navigation, route }: ProfileStackProps) => {
  const { colors } = useTheme()
  const screenName = route.params?.screenName

  const newMessagesCount = 0 // надо достать кол-во новых сообщений в чате

  // const newMessages = useSelector((state: AppState) => state.chat.newNotifications || [])
  // const newMessagesCount = newMessages.filter(notification => notification.isNew).length
  return (
    <ProfileNavigator.Navigator headerMode='none' initialRouteName={'ProfileScreen'}>
      <ProfileNavigator.Screen
        name='ProfileScreen'
        component={ProfileScreen}
        initialParams={{
          colors,
          newMessagesCount,
          screenName: (arg: string) => screenName(arg),
        }}
      />
      <ProfileNavigator.Screen
        name='ProfileEditScreen'
        component={ProfileEditScreen}
        initialParams={{
          colors,
          screenName: (arg: string) => screenName(arg),
        }}
      />
      <ProfileNavigator.Screen name='CarEditScreen' component={CarEditScreen} initialParams={{ colors }} />
      <ProfileNavigator.Screen
        name='NotificationSettingsScreen'
        component={NotificationSettingsScreen}
        initialParams={{ colors }}
      />
      <ProfileNavigator.Screen name='AgreementsScreen' component={AgreementsScreen} initialParams={{ colors }} />
      <ProfileNavigator.Screen name='DocumentsScreen' component={DocumentsScreen} initialParams={{ colors }} />
      <ProfileNavigator.Screen
        name='PassportScreen'
        component={PassportScreen}
        initialParams={{
          colors,
          screenName: (arg: string) => screenName(arg),
        }}
      />
      <ProfileNavigator.Screen
        name='AgreementScreen'
        component={AgreementScreen}
        initialParams={{
          colors,
          screenName: (arg: string) => screenName(arg),
        }}
      />
    </ProfileNavigator.Navigator>
  )
}

function getIcon(name: IconsType, color: string, notificationsCount?: number) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Icon name={name} size={23} color={color} />
      <Badge count={notificationsCount} style={styles.badge} />
    </View>
  )
}

export default function AppMainNavigator() {
  const token = useSelector((state: AppState) => state.auth.token)
  const { profile } = useSelector((state: AppState) => state.user)
  const theme = useSelector((state: AppState) => state.app.theme)
  const deviceTheme = useSelector((state: AppState) => state.app.deviceTheme)
  const deviceScheme = useColorScheme()
  const { started } = useSelector((state: AppState) => state._app)
  const _theme = ThemesList[deviceTheme ? deviceScheme : theme]
  const colors = _theme.colors

  RNAppState.addEventListener('change', (state) => {
    if (state === 'active' && started) {
      //temporally
      // SplashScreen.hide()
    }
  })

  return (
    <NavigationContainer theme={_theme} linking={linking}>
      <Alert />
      <RootNavigator.Navigator
        headerMode='none'
        screenOptions={{
          animationEnabled: false,
          gestureEnabled: true,
        }}
      >
        {!token || !profile ? (
          <RootNavigator.Screen name='Auth' component={AuthStack} />
        ) : !profile.first_name ? (
          <RootNavigator.Screen name='Registration' component={RegistrationStack} />
        ) : (
          <RootNavigator.Screen name='Main' component={MainStack} />
        )}

        <RootNavigator.Screen name='NotificationsScreen' component={NotificationsScreen} initialParams={{ colors }} />
        <RootNavigator.Screen name='AgreementScreen' component={AgreementScreen} initialParams={{ colors }} />
      </RootNavigator.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  // shadow: {
  //   shadowRadius: 3,
  //   shadowOffset: {
  //     width: 0,
  //     height: 0,
  //   },
  //   shadowOpacity: 0.5,
  //   elevation: 3,
  // },
  badge: {
    top: 10,
    right: 0,
  },
})

const linking = {
  prefixes: ['templateapp://', 'http://templateapp.com/', 'https://templateapp.com/'],
  config: {
    screens: {
      Main: {
        screens: {
          ProfileScreen: 'profile',
          NotificationsScreen: 'notifications',
        },
      },
    },
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url)

    Linking.addEventListener('url', onReceiveURL)
    OneSignal.setNotificationOpenedHandler((notification) => {
      const url = notification.notification.launchURL
      listener(url || 'templateapp://notifications')
    })
    return () => {
      Linking.removeAllListeners('url')
    }
  },
} as LinkingOptions

function getRouteData(route: Route): RouteData {
  return {
    screenName: route?.name,
    showTabBar: route?.params?.showTabBar || false,
  }
}
