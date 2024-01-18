import { isSmallScreen } from '../../theme'

const RegistrationPhoneScreenImg = require('./RegistrationPhoneScreenImg.png')
const SuccessfullRegistrationImg = require('./SuccessfullRegistrationImg.png')
const TripEmpty = require('./TripEmpty.png')
const RectanglePassport = require('./rec-passport.png')
const BookingSuccessLight = require('./BookingSuccessLight.png')
const BookingSuccessDark = require('./BookingSuccessDark.png')
const MyTripsDark = require('./MyTripsDark.png')
const MyTripsLight = require('./MyTripsLight.png')
const WaypointCircle = require('./WaypointCircle.png')
const WaypointLine = require('./WaypointLine.png')
const WaypointSolidLine = require('./WaypointSolidLine.png')
const BackgroundLight = isSmallScreen()
  ? require('./background/lightSmall.png')
  : require('./background/lightMedium.png')
const BackgroundDark = isSmallScreen() ? require('./background/darkSmall.png') : require('./background/darkMedium.png')
const SearchTripsEmptyLight = require('./SearchTripsEmptyLight.png')
const SearchTripsEmptyDark = require('./SearchTripsEmptyDark.png')
const WelcomeLight = require('./WelcomeLight.png')
const WelcomeDark = require('./WelcomeDark.png')
const RegistrationSuccessDark = require('./RegistrationSuccessDark.png')
const RegistrationSuccessLight = require('./RegistrationSuccessLight.png')

export {
  RegistrationPhoneScreenImg,
  RectanglePassport,
  SuccessfullRegistrationImg,
  TripEmpty,
  BookingSuccessLight,
  BookingSuccessDark,
  MyTripsDark,
  MyTripsLight,
  WaypointCircle,
  WaypointLine,
  WaypointSolidLine,
  BackgroundLight,
  BackgroundDark,
  SearchTripsEmptyLight,
  SearchTripsEmptyDark,
  WelcomeLight,
  WelcomeDark,
  RegistrationSuccessDark,
  RegistrationSuccessLight,
}
