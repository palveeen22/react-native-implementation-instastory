import type { CompositeNavigationProp, ParamListBase } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CarType, UserProfile } from '../types'
import { ThemeColors } from '../theme'

// MainStack
//
type MainStackParamList = {
  SearchTripStack: undefined
  MyTripsStack: undefined
  NewTripStack: undefined
  ProfileStack: undefined
}

export type MainStackNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<MainStackParamList>, any>

export type MainStackRouteProp = RouteProp<MainStackParamList, keyof MainStackParamList>

export type MainStackProps = {
  navigation: MainStackNavigationProp
  route: MainStackRouteProp
}

// ProfileStack
//
export type ProfileStackParamList = {
  ProfileScreen: { colors: string; newMessagesCount: number; screenName: (arg: string) => void }
  ProfileEditScreen: { colors: string; screenName?: (arg: string) => void }
  CarEditScreen: { colors: string }
  NotificationSettingsScreen: { colors: string }
  AgreementsScreen: { colors: string }
  AgreementScreen: { colors: string; screenName?: (arg: string) => void }
}

export type ProfileStackNavigationProp = StackNavigationProp<ProfileStackParamList, keyof ProfileStackParamList>

export type ProfileStackProps = {
  navigation: CompositeNavigationProp<ProfileStackNavigationProp, any>
  route: { params?: { screenName?: (arg: string) => void } }
}

// SearchTripStack
//
export type SearchTripStackParamList = {
  SearchTripScreen: { colors: string }
  SearchTripResultsScreen: { colors: string }
  SearchTripFilterScreen: { colors: string }
}

export type SearchTripStackNavigationProp = StackNavigationProp<
  SearchTripStackParamList,
  keyof SearchTripStackParamList
>

export type SearchTripStackProps = {
  navigation: CompositeNavigationProp<SearchTripStackNavigationProp, any>
}

// NewTripStack
//
export type NewTripStackParamList = {
  NewTripScreen: { colors: string }
  NewTripIntermediateCitiesScreen: { colors: string; screenName?: (arg: string) => void }
  NewTripIntermediatePriceScreen: { colors: string }
  NewTripDetailScreen: { colors: string }
  CarEditScreen: { colors: string }
  NewTripPublishScreen: { colors: string }
}

export type NewTripStackNavigationProp = StackNavigationProp<NewTripStackParamList, keyof NewTripStackParamList>

export type NewTripStackProps = {
  navigation: CompositeNavigationProp<NewTripStackNavigationProp, any>
  route: { params?: { screenName?: (arg: string) => void } }
}

// MyTripStack
//
export type MyTripsStackParamList = {
  MyTripsScreen: { colors: string }
  TripDetailScreen: { colors: string; screenName?: (arg: string) => void }
  PublicProfileViewScreen: { colors: string; screenName?: (arg: string) => void }
}

export type MyTripsStackNavigationProp = StackNavigationProp<MyTripsStackParamList, keyof MyTripsStackParamList>

export type MyTripsStackProps = {
  navigation: CompositeNavigationProp<MyTripsStackNavigationProp, any>
  route: { params?: { screenName?: (arg: string) => void } }
}

// RadioStack
//
export type RadioStackParamList = {
  RadioScreen: { colors: string }
}

export type RadioStackNavigationProp = StackNavigationProp<RadioStackParamList, keyof RadioStackParamList>

export type RadioStackProps = {
  navigation: CompositeNavigationProp<RadioStackNavigationProp, any>
}

// RegistrationStack
//
export type RegistrationStackParamList = {
  ProfileEditScreen: { colors: string; registration: true; screenName?: () => void }
}

export type RegistrationStackNavigationProp = StackNavigationProp<
  RegistrationStackParamList,
  keyof RegistrationStackParamList
>

export type RegistrationStackProps = {
  navigation: CompositeNavigationProp<RegistrationStackNavigationProp, any>
  route: { params?: { screenName?: (arg: string) => void } }
}

// AuthStack
//
export type AuthStackParamList = {
  AuthScreen: { colors: string }
  PhoneConfirmScreen: { colors: string }
  CodeConfirmScreen: { colors: string }
}

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList, keyof AuthStackParamList>

export type AuthStackProps = {
  navigation: CompositeNavigationProp<AuthStackNavigationProp, any>
}
