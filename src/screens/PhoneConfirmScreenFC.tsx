/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextStyle,
  View,
  TextInput as RNTextInput,
  ViewStyle,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Linking } from 'react-native';
import { Screen, Button, TextInput, Switch, Markdown, Icon, Alert } from '../components'
import { t } from '../localization'
import { CountryType, Nullable, PhoneType } from '../types'
import { ThemeColors, font, isSmallScreen, marginBottom } from '../theme'
import { authRequestAction, authRequestAppleAction, authRequestGoogleAction, authRequestYandexAction } from '../store/redux/auth'
import config from '../config'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTheme } from '@react-navigation/native'
import { authorize } from 'react-native-app-auth'
import { useYandexAuth } from '../helpers/useYandexAuth'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type PhoneConfirmScreenProps = ScreenProps & StateProps & {}

interface State {
  phone: Nullable<string>
  country_code: Nullable<string>
  url_logo: Nullable<string>
  countrySelected: boolean
  showCountriesModal: boolean
  isAgreementAccepted: boolean
  countdown: number
  code_error: boolean
}

const PhoneConfirmScreen: React.FC<PhoneConfirmScreenProps> = ({
  countries,
  country,
  route,
  countries_fetching,
  countries_error,
  navigation,
  sendCode,
  sendCodeGoogle,
  sendCodeApple,
  sendCodeYandex,
}) => {
  const colors: ThemeColors = route.params?.colors

  const inputRef = useRef<RNTextInput>()
  const { dark } = useTheme()
  const [state, setState] = useState<State>({
    phone: null,
    country_code: '+7',
    url_logo: 'storage/flags/Россия.svg',
    countrySelected: false,
    showCountriesModal: false,
    isAgreementAccepted: false,
    countdown: config.timerDuration,
    code_error: false,
  })
  const [wayConfirmation, setWayConfirmation] = useState<string>('')

  useEffect(() => {
    setCountry()
  }, [])

  useEffect(() => {
    if (!countries_fetching && !countries_error) {
      setCountry()
    }
    // if (state.countrySelected && countries?.length > 1) {
    //   //WARNING: HERE
    //   inputRef.current.focus()
    // }
  }, [state.countrySelected, countries, countries_fetching])

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);


    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // if (!appleAuthRequestResponse.email) {
      //   Alert.alert("Для привязки аккаунта необходимо указать идентификатор Apple ID (e-mail)")
      // }
      sendCodeApple({
        email: appleAuthRequestResponse.email,
        user: appleAuthRequestResponse.user,
        first_name_apple: appleAuthRequestResponse.fullName.givenName,
        last_name_apple: appleAuthRequestResponse.fullName.familyName,
      })
    }
  }

  const onLogin = () => {
    let codeToTelegram = true
    if (wayConfirmation === 'sms') {
      codeToTelegram = false
    } else {
      onLoginTelegram()
    }
    const _phone = state?.country_code.replace('+', '') + state.phone
    navigation.navigate('CodeConfirmScreen', { phone: _phone, fromTelegram: codeToTelegram }) // THIS IS FOR PHONE
  }
  const onLoginGoogle = () => {
    GoogleSignin.configure({
      webClientId: '351493338268-8p3kmrnutq2pskts8urf0h1nojubulnu.apps.googleusercontent.com',
      // webClientId: '351493338268-hm9d3olkcehmb429sg6aol5qau03ctae.apps.googleusercontent.com',
      iosClientId: '351493338268-t8meblmq0prtqt9j4md8pvlq051p2k45.apps.googleusercontent.com',
    });

    GoogleSignin.hasPlayServices().then((hasPlayService) => {
      if (hasPlayService) {
        GoogleSignin.signIn().then((userInfo) => {
          sendCodeGoogle({
            auth_token: userInfo.idToken,
          })
        }).catch((e) => {
          console.log('ERROR IS=====>>>>>>: ' + JSON.stringify(e));
        })
      }
    }).catch((e) => {
      console.log('ERROR IS: ' + JSON.stringify(e));
    })
  }

  const onLoginTelegram = () => {
    const telegramBotUrl = 'https://t.me/Bibig_Trip_Bot'; // Replace with your Telegram bot URL
    Linking.openURL(telegramBotUrl)
      .catch(error => {
        // Handle error if the Telegram app is not installed or if URL cannot be opened
        console.error('Error opening Telegram bot:', error);
      });
  }

  const onPhoneChange = (phone: string) => {
    const { phone: phoneNumber, ...rest } = state
    setState({ phone, ...rest })
  }

  const onIsAgreementAcceptedPress = (isAgreementAccepted: boolean) => {
    const { isAgreementAccepted: setAgreement, ...rest } = state

    setState({ isAgreementAccepted, ...rest })
  }

  const setCountry = () => {
    if (countries?.length) {
      const { countrySelected, ...rest } = state
      // if (countries[0].id !== country?.id) {
      //   setCurrentCountry({ country_id: countries[0].id })
      // }
      // phone: null,
      // countrySelected: false,
      // showCountriesModal: false,
      // isAgreementAccepted: false,
      // countdown: config.timerDuration,
      // code_error: false,
      setState({ countrySelected: true, ...rest })
    }
  }

  const onLinkPress = (link: string) => {
    const agreement = country.documents.find((el) => el.type === link)

    if (agreement) {
      navigation.navigate('AgreementScreen', { agreement })
    }
  }

  const { handler, stateYandex } = useYandexAuth()
  const stateYandexValue = JSON.stringify(stateYandex, null, 2)

  useEffect(() => {
    // setCountry()
    if (stateYandex?.accessToken) {
      const { id, first_name, last_name, default_email } = stateYandex?.userInfo
      sendCodeYandex({
        email: default_email,
        yandex_id: id,
        first_name_yandex: first_name,
        last_name_yandex: last_name,
      })
    }
  }, [stateYandex])

  return (
    <Screen title={t('login_registration')} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.secondaryTextStyle, { color: colors.text.default }]}>{t('phone_number')}</Text>
      <View style={{
        flexDirection: 'column',
      }}>
        <View
          style={{
            alignContent: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <TextInput
              // ref={inputRef}
              value={state.url_logo}
              // value={state.country_code}
              placeholder={t('country_code')}
              type={'countryList'}
              // onChange={onPhoneChange}
              style={styles.codeCountryInput}
              // editable={state.countrySelected}
              dataList={countries}
              onPress={() => {
                setState({ showCountriesModal: true, ...state })
              }}
              onSuggestSelect={(val: PhoneType) => {
                setState({
                  ...state,
                  url_logo: val?.url_logo,
                  country_code: val?.phone_code,
                })
              }}
            />
            <TextInput
              // ref={inputRef}
              value={state.phone}
              placeholder={t('phone_number')}
              type={'phone'}
              onChange={onPhoneChange}
              style={styles.emailInput}
              editable={state.countrySelected}
              onPress={() => {
                setState({ showCountriesModal: true, ...state })
              }}
              countryCode={+state.country_code?.slice(1)}
            />
          </View>
          {state.countrySelected && !!country?.documents && (
            <View style={styles.agreementContainer}>
              <Switch type={'checkbox'} selected={state.isAgreementAccepted} onChange={onIsAgreementAcceptedPress} />
              <Markdown
                style={styles.agreementMarkdown}
                text={t('auth_agreement')}
                paragraphStyle={[styles.agreementText, { color: colors.text.secondary }]}
                linkStyle={[styles.agreementText, { color: colors.text.default }]}
                onLinkPress={onLinkPress}
              />
            </View>
          )}
          {/* color: "#ffffff" */}
          <Text style={[styles.secondaryTextStyle, {
            color: colors.text.default,
            fontWeight: 'bold',
            marginTop: 30,
          }]}>{t('сhoosing_way')}</Text>
          <View style={styles.containerBox}>
            {/* FOR WAHTSAPP */}
            {/* <View style={styles.box}>
              <TouchableOpacity disabled style={styles.buttonOptions}>
                <Text style={[styles.buttonText]}>WhatsApp</Text>
              </TouchableOpacity>
            </View> */}
            <TouchableOpacity
              onPress={() => setWayConfirmation("telegram")}
              style={[styles.box, {
                backgroundColor: wayConfirmation === 'telegram' ? '#4D2186' : '#F2F2F2'
              }]}>
              <View style={styles.buttonOptions}>
                <Text style={[styles.buttonText, {
                  color: wayConfirmation === 'telegram' ? '#ffffff' : 'black'
                }]}>Telegram</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setWayConfirmation("sms")}
              style={[styles.box, { backgroundColor: wayConfirmation === 'sms' ? '#4D2186' : '#F2F2F2' }]}>
              <View style={styles.buttonOptions}>
                <Text style={[styles.buttonText, {
                  color: wayConfirmation === 'sms' ? '#ffffff' : 'black'
                }]}>SMS</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              disabled={
                (state.country_code.length > 2 ? state.phone?.length !== 9 : state.phone?.length !== 10) ||
                (!!country?.documents && !state.isAgreementAccepted) || !wayConfirmation
              }
              text={t('recive_code')}
              type={'primary'}
              onPress={onLogin}
              style={styles.button}
            />
          </View>
        </View>
        {/* <View style={styles.resend.container}>
          {countdown === 0 ? (
            <Pressable onPress={this.resendCode}>
              <Text style={[styles.resend.action, { color: colors.text.action }]}> {t('code_not_come')}</Text>
            </Pressable>
          ) : (
            <>
              <Text style={[styles.resend.placeholder, { color: colors.text.secondary }]}>
                {t('repeat_send_code', [countdown])}
              </Text>
              <Timer duration={config.timerDuration} onTick={(countdown) => this.setState({ countdown })} />
            </>
          )}
        </View> */}

        <View style={[styles.optionAuth, { marginTop: marginBottom() }]}>
          <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>или</Text>
            <View style={styles.line} />
          </View>
          <Text style={[styles.signupText, { color: colors.text.default }]}>Продолжить с помощью</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity onPress={handler.onLogin}>
                <View style={styles.circle}>
                  <Icon name={'yandexIcon'} />
                </View>
              </TouchableOpacity>
            ) : (<></>)}
            <TouchableOpacity onPress={onAppleButtonPress}>
              <View style={styles.circle}>
                <Icon name={dark ? 'appleIconDarkBackgorund' : 'appleIconLightBackgorund'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLoginGoogle}>
              <View style={styles.circle}>
                <Icon name={'googleIcon'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Screen>
  )

  //FROM BEFORE
  // resendCode = () => {
  //   const { sendCode, phone } = this.props;
  //   sendCode({ phone });
  //   this.setState({ countdown: -1, code_error: false });
  // }

  // onCodeEntered = (code: string) => {
  //   if (!code) {
  //     return;
  //   }
  //   const { sendCode, phone } = this.props;
  //   this.setState({ code_error: false }, () => {
  //     sendCode({ phone, code });
  //   });
  // }
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  phone: state.auth.phone,
  fetching: state.auth.fetching,
  error: state.auth.error,
  countries: state.countries.countries,
  countries_fetching: state.countries.fetching,
  countries_error: state.countries.error,
  country: state.countries.country,
})

const mapDispatchToProps = {
  sendCode: authRequestAction,
  sendCodeGoogle: authRequestGoogleAction,
  sendCodeApple: authRequestAppleAction,
  sendCodeYandex: authRequestYandexAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneConfirmScreen)

const commonStyles = {
  resend: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  } as TextStyle,
}

const styles = {
  // containercontainer: {
  //   flex: 1,
  // },
  // inner: {
  //   padding: 24,
  //   flex: 1,
  //   justifyContent: 'space-around',
  // },
  // header: {
  //   fontSize: 36,
  //   marginBottom: 48,
  // },
  // textInput: {
  //   height: 40,
  //   borderColor: '#000000',
  //   borderBottomWidth: 1,
  //   marginBottom: 36,
  // },
  containerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    // width: isSmallScreen() ? 80 : 110,//FOR WHATSAPP
    width: isSmallScreen() ? 116 : 160,//FOR WHATSAPP
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  buttonOptions: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: isSmallScreen() ? 10 : 15,
    // fontWeight: 'bold',
  },
  optionAuth: {
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: 'black',
  },
  signupText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    marginVertical: 10,
    borderColor: 'rgba(138, 138, 143, 1)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#AEAEAE',
  },
  text: {
    marginHorizontal: 10,
    color: '#AEAEAE',
    fontSize: 16,
    // fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    // borderRadius: 100,
    // paddingHorizontal: 20,
    // paddingBottom: 20,
    // justifyContent: 'flex-end',
  },
  codeCountryInput: {
    marginTop: 10,
    width: 80,
  },
  emailInput: {
    marginTop: 10,
    flex: 1,
  },
  keyboard: {
    flex: 5,
  },
  agreementContainer: {
    marginTop: 14,
    flexDirection: 'row',
  },
  agreementText: {
    marginTop: 0,
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
  },
  agreementMarkdown: {
    flex: 1,
    marginLeft: 12,
  },
  contentContainer: {
    paddingHorizontal: 16,
    flex: 1,
  } as ViewStyle,

  secondaryTextStyle: {
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 5,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'left',
  } as TextStyle,

  codeInput: {
    marginTop: 25,
    alignItems: 'center',
  } as ViewStyle,

  resend: {
    container: {
      marginTop: 32,
      alignItems: 'center',
    } as ViewStyle,
    placeholder: {
      ...commonStyles.resend,
      fontFamily: font(),
    } as TextStyle,
    action: {
      ...commonStyles.resend,
      fontFamily: font(600),
    } as TextStyle,
  },
}
