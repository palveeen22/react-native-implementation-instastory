import React, { useEffect, useRef, useState } from 'react'
import { Text, StyleSheet, View, TextInput as RNTextInput } from 'react-native'
import { connect } from 'react-redux'
import { AppState } from '../store'
import { StackScreenProps } from '@react-navigation/stack'
import { Screen, Button } from '../components/'
import { Nullable } from '../types'
import { t } from '../localization'
import { font, isSmallScreen } from '../theme'
import { countryRequestAction } from '../store/redux/countries'
import LottieView from 'lottie-react-native'

type ScreenProps = DispatchProps & StateProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

interface Props extends ScreenProps { }
interface Wishes {
  morning: string
  day: string
  evening: string
  night: string
}

const listWishes: Wishes = {
  morning: t('good_morning'),
  day: t('good_day'),
  evening: t('good_evening'),
  night: t('good_night'),
}

const AuthScreen: React.FC<Props> = ({
  theme,
  route,
  setCurrentCountry,
  countries,
  countries_error,
  countries_fetching,
  country,
  navigation,
}) => {
  const inputRef = useRef<RNTextInput>()
  const [phone, setPhone] = useState<Nullable<string>>(null)
  const [countrySelected, setCountrySelected] = useState<boolean>(false)
  // const [showCountriesModal, setShowCountriesModal] = useState<boolean>(false)
  // const [isAgreementAccepted, setIsAgreementAccepted] = useState<boolean>(false)
  const [isDark, setIsDark] = useState<boolean>(false)
  const [wish, setWish] = useState<string>('morning')

  useEffect(() => {
    setCountry()
    const currentHour = new Date().getHours()
    let getHour: string = ''
    let getIsDarkMode: boolean = false
    if (currentHour >= 4 && currentHour < 12) {
      getHour = 'morning'
      getIsDarkMode = false
    } else if (currentHour >= 12 && currentHour < 18) {
      getHour = 'day'
      getIsDarkMode = false
    } else if (currentHour >= 18 && currentHour < 22) {
      getHour = 'evening'
      getIsDarkMode = true
    } else {
      getHour = 'night'
      getIsDarkMode = true
    }
    setIsDark(getIsDarkMode)
    setWish(getHour)
  }, [])

  useEffect(() => {
    if (!countries_fetching && !countries_error) {
      setCountry()
    }
    if (countrySelected && countries?.length > 1) {
      // inputRef.current.focus()
    }
  }, [countries_fetching, countries, countries_error])

  const onLogin = () => {
    navigation.navigate('PhoneConfirmScreen')
  }

  const setCountry = () => {
    if (countries?.length) {
      if (countries[0].id !== country?.id) {
        setCurrentCountry({ country_id: countries[0].id })
      }
      setCountrySelected(true)
    }
  }

  /* // не используемые методы
  const onPhoneChange = (phone: string) => {
    setPhone(phone)
  }
  const onCountrySelect = (country: CountryType) => {
    setCurrentCountry({ country_id: country.id })
    setCountrySelected(true)
    setShowCountriesModal(false)
  }

  const onIsAgreementAcceptedPress = (isAgreementAccepted: boolean) => {
    setIsAgreementAccepted(isAgreementAccepted)
  }

  const onLinkPress = (link: string) => {
    const agreement = country.documents.find((agreement) => agreement.type === link)

    if (agreement) {
      navigation.navigate('AgreementScreen', { agreement })
    }
  }
  */

  return (
    <Screen hideHeader={true} safeArea={false} enableScroll={false}>
      <LottieView
        source={
          isDark ? require('./data_NY_bibig_splash_day.json') : require('./data_NY_bibig_splash_night.json')
        }
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <Text style={[styles.welcomeText, { color: '#FFFFFF' }]}>{listWishes[wish]}</Text>
      <View style={styles.image} />
      <View style={styles.footer}>
        <Button
          disabled={false}
          text={t('to_come_in')}
          type={'primary'}
          onPress={onLogin}
          style={styles.button}
          textStyle={{ color: '#4D2186' }}
        />
      </View>
    </Screen>
  )
}

const mapStateToProps = (state: AppState) => ({
  countries: state.countries.countries,
  countries_fetching: state.countries.fetching,
  countries_error: state.countries.error,
  country: state.countries.country,
  theme: state.app.theme,
})

const mapDispatchToProps = {
  setCurrentCountry: countryRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  backgroundAnimation: {
    position: 'absolute',
    top: -67,
    left: 0,
    width: '100%',
    height: '120%',
  },
  border: {
    borderBottomWidth: 1,
  },
  image: {
    marginTop: 20,
    alignSelf: 'center',
    width: 268,
    height: 196,
    flex: 1,
  },
  emailInput: {
    marginTop: 50,
  },
  welcomeText: {
    fontFamily: font(700),
    fontSize: isSmallScreen() ? 24 : 32,
    lineHeight: isSmallScreen() ? 31 : 41,
    alignSelf: 'center',
    letterSpacing: -1,
    paddingTop: 140,
    position: 'relative',
  },
  welcomeTextDescription: {
    fontFamily: font(300),
    fontSize: 11,
    lineHeight: 13,
    marginTop: 10,
    alignSelf: 'center',
  },
  registration: {
    fontFamily: font(600),
    fontSize: 11,
    lineHeight: 13,
    marginTop: 10,
    alignSelf: 'center',
  },
  passwordInput: {
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 44,
  },
  button: {
    marginTop: 120,
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    borderRadius: 15,
    // zIndex: 200,
  },
  forgotPassword: {
    marginTop: 15,
    alignSelf: 'center',
    fontFamily: font(400),
    fontSize: 11,
    lineHeight: 13,
  },
  counrtiesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    flex: 1,
  },
  countriesContent: {
    paddingVertical: 8,
  },
  countryCode: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'right',
  },
  countryName: {
    paddingLeft: 10,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
  },
  descriptionText: {
    marginTop: 12,
    fontFamily: font(300),
    fontSize: 14,
    lineHeight: 18,
    alignSelf: 'center',
  },
  agreementContainer: {
    marginTop: 14,
    flexDirection: 'row',
  },
  agreementMarkdown: {
    flex: 1,
    marginLeft: 12,
  },
  agreementText: {
    marginTop: 0,
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
  },
})
