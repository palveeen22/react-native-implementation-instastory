import React from 'react'
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
} from 'react-native'
import { Screen, Button, TextInput, Switch, Markdown } from '../components'
import { t } from '../localization'
import { CountryType, Nullable } from '../types'
import { ThemeColors, font } from '../theme'
import { authRequestAction } from '../store/redux/auth'
import config from '../config'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  phone: Nullable<string>
  countrySelected: boolean
  showCountriesModal: boolean
  isAgreementAccepted: boolean
  countdown: number
  code_error: boolean
}

class PhoneConfirmScreen extends React.Component<Props, State> {
  inputRef: React.MutableRefObject<RNTextInput>
  constructor(props) {
    super(props)
    this.state = {
      phone: null,
      countrySelected: false,
      showCountriesModal: false,
      isAgreementAccepted: false,
      countdown: config.timerDuration,
      code_error: false,
    }
  }
  componentDidMount(): void {
    // const { sendCode, route } = this.props
    // const phone: string = route?.params?.phone
    // sendCode({ phone })
    this.setCountry()
  }

  // componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
  //   const { fetching, error, navigation } = this.props
  //   if (prevProps.fetching && !fetching && !!error) {
  //     this.setState({ code_error: true })
  //   }
  // }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { countrySelected } = this.state
    const { countries_fetching, countries_error, countries } = this.props

    if (prevProps.countries_fetching && !countries_fetching && !countries_error) {
      this.setCountry()
    }

    if (!prevState.countrySelected && countrySelected && countries?.length > 1) {
      this.inputRef?.current.focus()
    }
  }

  render() {
    const colors: ThemeColors = this.props.route.params.colors
    const { countdown, code_error, phone, showCountriesModal, countrySelected, isAgreementAccepted } = this.state
    const { countries, country } = this.props

    return (
      <Screen title={t('login_registration')} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.secondaryTextStyle, { color: colors.text.default }]}>{t('phone_number')}</Text>
        <View>
          <TextInput
            getRef={(ref) => (this.inputRef = ref)}
            value={phone}
            placeholder={t('phone_number')}
            type={'phone'}
            onChange={this.onPhoneChange}
            style={styles.emailInput}
            editable={countrySelected}
            onPress={() => this.setState({ showCountriesModal: true })}
            countryCode={+(country?.phone_code.replace('+', '') || 0)}
          />
          {countrySelected && !!country?.documents && (
            <View style={styles.agreementContainer}>
              <Switch type={'checkbox'} selected={isAgreementAccepted} onChange={this.onisAgreementAcceptedPress} />
              <Markdown
                style={styles.agreementMarkdown}
                text={t('auth_agreement')}
                paragraphStyle={[styles.agreementText, { color: colors.text.secondary }]}
                linkStyle={[styles.agreementText, { color: colors.text.default }]}
                onLinkPress={this.onLinkPress}
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button
              disabled={phone?.length !== 10 || (!!country?.documents && !isAgreementAccepted)}
              text={t('recive_code')}
              type={'primary'}
              onPress={this.onLogin}
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
      </Screen>
    )
  }

  onLogin = () => {
    const { phone } = this.state
    const { navigation, country } = this.props
    const _phone = country.phone_code.replace('+', '') + phone
    navigation.navigate('CodeConfirmScreen', { phone: _phone }) // THIS IS FOR PHONE
  }

  onPhoneChange = (phone: string) => {
    this.setState({ phone })
  }

  onisAgreementAcceptedPress = (isAgreementAccepted: boolean) => {
    this.setState({ isAgreementAccepted })
  }

  setCountry = () => {
    const { countries, country, setCurrentCountry } = this.props
    if (countries?.length === 1) {
      if (countries[0].id !== country?.id) {
        setCurrentCountry({ country_id: countries[0].id })
      }
      this.setState({ countrySelected: true })
    }
  }

  onLinkPress = (link: string) => {
    const { country, navigation } = this.props

    const agreement = country.documents.find((agreement) => agreement.type === link)

    if (agreement) {
      navigation.navigate('AgreementScreen', { agreement })
    }
  }

  //INI DARI SEBELUM
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
  // btnContainer: {
  //   backgroundColor: 'white',
  //   marginTop: 12,
  // },
  button: {
    marginTop: 20,
    borderRadius: 15,
  },
  buttonContainer: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
    // justifyContent: 'flex-end',
  },
  emailInput: {
    marginTop: 10,
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
