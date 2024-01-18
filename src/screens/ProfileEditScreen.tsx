import React from 'react'
import { connect, useSelector } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, ViewStyle, TextStyle, ScrollView, TouchableOpacity, Linking } from 'react-native'
import {
  Screen,
  Button,
  TextInput,
  Selector,
  ListItem,
  ImagePicker,
  RegistrationSuccessImage,
  InfoModal,
  DatePicker,
  ScreenStyles,
  CodeInput,
  Switch,
  Markdown,
  Alert,
} from '../components'
import { t } from '../localization'
import { ThemeColors, font, isSmallScreen } from '../theme'
import moment from 'moment'
import 'moment/locale/ru'
moment().locale('ru')
import { CarType, GenderType, Nullable, PickedFileType } from '../types'
import { userProfileRequestAction, userProfileUpdateAction } from '../store/redux/user'
import { carsRequestAction } from '../store/redux/cars'
import { authLogoutRequestAction, authRequestAction, authRequestGoogleCheckAction } from '../store/redux/auth'
import { getScrollOffset } from '../services'
import AppMetrica from 'react-native-appmetrica'
import { showMessage } from 'react-native-flash-message'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  first_name: Nullable<string>
  last_name: Nullable<string>
  birthday: Nullable<string>
  gender: Nullable<GenderType>
  confirm: boolean
  codeError: boolean
  show_code: boolean
  phone: Nullable<string>
  email: Nullable<string>
  photo: Nullable<string>
  newPhoto: Nullable<PickedFileType>
  showDatePickerModal: boolean
  photo_id: Nullable<number>
  showRegistrationSuccessModal: boolean
  scrollOffset: number
  contentHeight: number
  saveButtonDisabled: boolean
  country_code: string
  wayConfirmation: string
  code_box_show: boolean
  passed_confirmation: boolean
  isAgreementAccepted: boolean
  url_logo: string
  first_name_apple: string
  last_name_apple: string
  first_name_yandex: string
  last_name_yandex: string
  yandex_id: string
}

class ProfileEditScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      first_name: null,
      last_name: null,
      birthday: null,
      gender: null,
      confirm: false,
      show_code: false,
      phone: null,
      email: null,
      photo: null,
      newPhoto: null,
      showDatePickerModal: false,
      photo_id: null,
      showRegistrationSuccessModal: false,
      codeError: false,
      scrollOffset: 0,
      contentHeight: 0,
      saveButtonDisabled: false,
      passed_confirmation: false,
      country_code: '+7',
      wayConfirmation: '',
      first_name_apple: '',
      last_name_apple: '',
      first_name_yandex: '',
      last_name_yandex: '',
      yandex_id: '',
      code_box_show: null,
      isAgreementAccepted: null,
      url_logo: 'storage/flags/Россия.svg',
    }
  }

  componentDidMount() {
    const { profile, getCars, route, navigation, error } = this.props
    const { screenName } = route.params
    navigation.addListener('beforeRemove', () => {
      this.setState({ scrollOffset: 0 })
      screenName('ProfileScreen')
    })

    screenName('ProfileEditScreen')

    const {
      first_name,
      last_name,
      birthday,
      gender,
      confirm,
      phone,
      email,
      photo,
      photo_id,
      first_name_apple,
      last_name_apple,
      first_name_yandex,
      last_name_yandex,
      yandex_id,
    } = profile || {}

    getCars()
    this.setState({
      first_name,
      last_name,
      birthday,
      gender,
      confirm,
      phone: phone?.substring(1),
      // phone: "79869048562",
      email,
      photo,
      photo_id,
      first_name_apple,
      last_name_apple,
      first_name_yandex,
      last_name_yandex,
      yandex_id,
    })
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const {
      fetching,
      error_login,
      error,
      fetching_login,
      navigation,
      route,
      hasProfile,
      profile,
      profile_registration_google,
    } = this.props
    const isRegistration: boolean = !!route.params?.registration

    if (prevProps.fetching && !fetching && !error) {
      if (isRegistration) {
        this.setState({ showRegistrationSuccessModal: true })
      } else {
        navigation.goBack()
      }
    }

    if (prevProps?.fetching_login && !fetching_login && !!error_login) {
      this.setState({ codeError: true })
    }

    if (
      hasProfile &&
      isRegistration &&
      profile_registration_google?.googleIdToken &&
      profile_registration_google?.first_name !== null
    ) {
      const { updateProfile, route } = this.props
      const { country_code, confirm, phone } = this.state

      const registrationDetail: any = {
        first_name: profile_registration_google?.first_name,
        last_name: profile_registration_google?.last_name,
        birthday: profile_registration_google?.birthday,
        confirm,
        phone: `${+country_code?.slice(1)}${phone}`,
        email: profile?.email,
        photo: profile_registration_google?.photo,
        googleIdToken: profile_registration_google?.googleIdToken,
      }

      updateProfile(registrationDetail)
    }
    // if (prevProps.fetching && !fetching && !error) {
    //   this.setState({ showRegistrationSuccessModal: true })
    // }
  }

  render() {
    const colors: ThemeColors = this.props.route.params.colors
    const {
      phone,
      photo,
      url_logo,
      country_code,
      first_name,
      last_name,
      show_code,
      birthday,
      showDatePickerModal,
      newPhoto,
      showRegistrationSuccessModal,
      scrollOffset,
      contentHeight,
      saveButtonDisabled,
      isAgreementAccepted,
      codeError,
      code_box_show,
      wayConfirmation,
      first_name_apple,
      last_name_apple,
      first_name_yandex,
      last_name_yandex,
      email,
    } = this.state

    const { cars, route, countries, profile, hasProfile, error_login } = this.props

    const isRegistration: boolean = !!route.params?.registration
    const currentDate = moment() // Get the current date
    const eighteenYearsAgo = currentDate.subtract(18, 'years') // Subtract 18 years from the current date

    return (
      <Screen
        title={t(isRegistration ? 'fill_profile' : 'edit_profile')}
        step={isRegistration ? [3, 3] : undefined}
        enableScroll={false}
        scrollOffset={scrollOffset}
        contentHeight={contentHeight}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onScroll={(e) => this.setState({ scrollOffset: getScrollOffset(e) })}
          scrollEventThrottle={1}
          onContentSizeChange={(w, contentHeight) => this.setState({ contentHeight })}
        >
          <ImagePicker style={styles.avatar} size={88} image={newPhoto?.uri || photo} onImageChange={this.onAddFiles} />

          <Text style={[styles.questionMargins, styles.whatIsNameStyle, { color: colors.text.title }]}>
            {t('what_is_you_name')}
          </Text>
          <TextInput
            editable={isRegistration ? !first_name_apple && !first_name_yandex : true}
            onChange={(e) => this.setState({ first_name: e })}
            value={isRegistration ? first_name_apple || first_name_yandex || first_name : first_name}
            placeholder={t('name')}
            animatedPlaceholder
          />
          <TextInput
            editable={isRegistration ? !last_name_apple && !last_name_yandex : true}
            onChange={(e) => this.setState({ last_name: e })}
            style={styles.inputSecondField}
            value={isRegistration ? last_name_apple || last_name_yandex || last_name : last_name}
            placeholder={t('surname')}
            animatedPlaceholder
          />

          {/* <Text style={[styles.questionStyle, styles.questionMargins, { color: colors.text.title }]}>
            {t('your_gender')}
          </Text>
          <View style={styles.flexRow}>
            <Selector
              style={{ flex: 1 }}
              text={t('female')}
              onPress={() => this.setState({ gender: 'woman' })}
              selected={gender === 'woman'}
            />
            <Selector
              style={{ marginLeft: 9, flex: 1 }}
              text={t('male')}
              onPress={() => this.setState({ gender: 'man' })}
              selected={gender === 'man'}
            />
          </View> */}

          <Text style={[styles.questionStyle, styles.questionMargins, { color: colors.text.title }]}>
            {t('how_old_are_you')}
          </Text>
          <View
            style={[
              styles.border,
              {
                borderColor: showDatePickerModal ? colors.textInput.border : 'transparent',
              },
            ]}
          >
            <TextInput
              value={
                birthday ? moment(birthday).format('DD MMMM YYYY') : moment(eighteenYearsAgo).format('DD MMMM YYYY')
              }
              editable={false}
              onChange={() => null}
              placeholder={t('birthday')}
              onPress={this.onBirthdayPress}
            />
          </View>

          {/* <View style={styles.questionMargins}>
            <Text style={[styles.questionStyle, { color: colors.text.title }]}>{t('id_confirmation')}</Text>
            <Text style={[styles.confirmationText, { color: colors.text.secondary }]}>
              {t('you_ready_show_documents')}
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Selector
              style={{ flex: 1 }}
              text={t('not_ready')}
              onPress={() => this.setState({ confirm: false })}
              selected={!this.state.confirm}
            />
            <Selector
              style={{ marginLeft: 9, flex: 1 }}
              text={t('ready')}
              onPress={() => this.setState({ confirm: true })}
              selected={this.state.confirm}
            />
          </View> */}

          <Text style={[styles.questionMargins, styles.questionStyle, { color: colors.text.title }]}>
            {t('user_contacts')}
          </Text>
          <TextInput
            editable={!profile?.googleIdToken && !first_name_apple && !first_name_yandex}
            onChange={(e) => this.setState({ email: e })}
            placeholder={t('email')}
            value={this.state.email}
          />
          {isRegistration && (profile?.googleIdToken || profile?.apple_id || profile?.yandex_id) ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <TextInput
                // ref={inputRef}
                value={url_logo}
                // value={state.country_code}
                placeholder={t('country_code')}
                type={'countryList'}
                // onChange={onPhoneChange}
                style={styles.codeCountryInput}
                // editable={state.countrySelected}
                dataList={countries}
                onPress={() => {
                  // setState({ showCountriesModal: true, ...state })
                }}
                onSuggestSelect={(val: PhoneType) => {
                  this.setState({
                    url_logo: val?.url_logo,
                    country_code: val?.phone_code,
                  })
                }}
              />
              <View style={{ flex: 1 }}>
                <TextInput
                  onChange={(e) => {
                    // const { token } = this.props
                    this.setState({ phone: e })
                    if (country_code.length > 2 ? e?.length === 9 : e?.length === 10) {
                      this.setState({ show_code: true })
                    } else {
                      this.setState({ show_code: false })
                    }
                  }}
                  type={'phone'}
                  style={styles.inputSecondField}
                  placeholder={t('telephone')}
                  value={phone}
                  countryCode={+country_code?.slice(1)}
                // countryCode={7}
                // editable={false} //CHANGE THIS
                />
                <Text style={[styles.notRequired, { color: colors.text.secondary }]}>{t('required')}</Text>
              </View>
            </View>
          ) : (
            <View></View>
          )}

          {/* {show_code && hasProfile === null && isRegistration && profile?.googleIdToken ? ( */}
          {isRegistration && (profile?.googleIdToken || profile?.apple_id || profile?.yandex_id) ? (
            <View>
              <View style={styles.agreementContainer}>
                <Switch type={'checkbox'} selected={isAgreementAccepted} onChange={this.onIsAgreementAcceptedPress} />
                <Markdown
                  style={styles.agreementMarkdown}
                  text={t('auth_agreement')}
                  paragraphStyle={[styles.agreementText, { color: colors.text.secondary }]}
                  linkStyle={[styles.agreementText, { color: colors.text.default }]}
                  onLinkPress={this.onLinkPress}
                />
              </View>
              <Text
                style={[
                  styles.secondaryTextStyle,
                  {
                    color: colors.text.default,
                    fontWeight: 'bold',
                    marginTop: 30,
                  },
                ]}
              >
                {t('сhoosing_way')}
              </Text>
              <View style={styles.containerBox}>
                <TouchableOpacity
                  onPress={() => this.setState({ wayConfirmation: 'telegram' })}
                  style={[
                    styles.box,
                    {
                      backgroundColor: wayConfirmation === 'telegram' ? '#4D2186' : '#F2F2F2',
                    },
                  ]}
                >
                  <View style={styles.buttonOptions}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: wayConfirmation === 'telegram' ? '#ffffff' : 'black',
                        },
                      ]}
                    >
                      Telegram
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ wayConfirmation: 'sms' })}
                  style={[styles.box, { backgroundColor: wayConfirmation === 'sms' ? '#4D2186' : '#F2F2F2' }]}
                >
                  <View style={styles.buttonOptions}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: wayConfirmation === 'sms' ? '#ffffff' : 'black',
                        },
                      ]}
                    >
                      SMS
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.buttonContainer, { marginTop: 20, marginHorizontal: 0 }]}>
                <Button
                  disabled={!wayConfirmation}
                  text={t('recive_code')}
                  type={'primary'}
                  onPress={this.getCode}
                  style={styles.button}
                />
              </View>
              {/* <View>
                <Text
                  style={[styles.secondaryTextStyle, { color: colors.text.default, marginTop: 20, fontWeight: 'normal' }]}
                >
                  {wayConfirmation === 'sms' ? t('sent_code_your_phone_sms_google') : t('sent_code_your_phone_telegram_google')}
                </Text>
                <CodeInput
                  style={styles.codeInput}
                  onCodeEntered={this.onCodeEntered}
                  error={codeError}
                  onChange={() => this.setState({ codeError: false })}
                />
              </View> */}

              {(code_box_show !== null && code_box_show) || error_login ? (
                <View>
                  <Text
                    style={[
                      styles.secondaryTextStyle,
                      { color: colors.text.default, marginTop: 20, fontWeight: 'normal' },
                    ]}
                  >
                    {wayConfirmation === 'sms'
                      ? t('sent_code_your_phone_sms_google')
                      : t('sent_code_your_phone_telegram_google')}
                  </Text>
                  <CodeInput
                    style={styles.codeInput}
                    onCodeEntered={this.onCodeEntered}
                    error={codeError}
                    onChange={() => this.setState({ codeError: false })}
                  />
                </View>
              ) : (
                <View></View>
              )}
            </View>
          ) : (
            <View></View>
          )}
          <View style={[styles.questionMargins, { flexDirection: 'row' }]}>
            <Text style={[styles.questionStyle, { color: colors.text.title }]}>{t('car')}</Text>
            <Text style={[styles.notRequired, { color: colors.text.secondary }]}> {t('not_required')}</Text>
          </View>
          <View>
            {cars?.map((car, index) => (
              <ListItem
                style={!!index && styles.inputSecondField}
                key={index.toString()}
                car={car}
                onPress={() => this.onCarPress(car)}
              />
            ))}
          </View>

          <Selector
            style={styles.addCar}
            text={t('add_car')}
            onPress={() => this.onCarPress()}
            selected
            icon={'plus_large'}
          />
        </ScrollView>
        <View style={[styles.buttonContainer]}>
          <Button style={styles.button} text={t('cancel')} onPress={this.onCancelEditProfile} type={'secondary'} />
          <Button
            // disabled={hasProfile === null && isRegistration && profile?.googleIdToken}
            // disabled={saveButtonDisabled}
            style={[styles.button, { marginLeft: 8 }]}
            text={t('save')}
            onPress={this.onSaveProfile}
            type={'primary'}
          />
        </View>

        <DatePicker
          modal
          mode={'date'}
          maximumDate={new Date(moment().add(-18, 'years').format('YYYY-MM-DDT00:00:00+00:00'))}
          isVisible={showDatePickerModal}
          date={new Date(birthday || new Date(moment().add(-18, 'years').format('YYYY-MM-DDT00:00:00+00:00')))}
          onConfirm={this.onBirthdayChange}
          onCancel={() => this.setState({ showDatePickerModal: false })}
          locale={'ru'}
          style={styles.datepicker}
          confirmText={t('accept')}
          cancelText={t('cancel')}
          title={t('birthday')}
        />

        <InfoModal
          image={<RegistrationSuccessImage />}
          isVisible={showRegistrationSuccessModal}
          title={t('you_successfully')}
          text={t('have_nice_ride')}
          buttons={[
            {
              type: 'primary',
              text: t('search_tour'),
              onPress: this.onPressGoMain,
            },
          ]}
        />
      </Screen>
    )
  }

  onAddFiles = (newPhoto: PickedFileType) => {
    this.setState({ newPhoto, photo: null, photo_id: null })
  }

  onCodeEntered = (code: string) => {
    //KIRIM DISINI
    const { sendCode } = this.props
    const { wayConfirmation, phone, country_code } = this.state
    if (!code) {
      return
    }
    sendCode({ phone: `${+country_code?.slice(1)}${phone}`, code })
    this.setState({ code_box_show: false })
  }

  getCode = () => {
    const { sendCode } = this.props
    const { country_code, phone } = this.state
    const { wayConfirmation } = this.state
    this.setState({ code_box_show: true })

    if (wayConfirmation === 'sms') {
      sendCode({ phone: `${+country_code?.slice(1)}${phone}` })
    } else {
      const telegramBotUrl = 'https://t.me/Bibig_Trip_Bot' // Replace with your Telegram bot URL
      Linking.openURL(telegramBotUrl).catch((error) => {
        // Handle error if the Telegram app is not installed or if URL cannot be opened
        console.error('Error opening Telegram bot:', error)
      })
    }
  }
  onIsAgreementAcceptedPress = (isAgreementAccepted: boolean) => {
    const { isAgreementAccepted: setAgreement, ...rest } = this.state
    this.setState({ isAgreementAccepted, ...rest })
  }

  onSaveProfile = () => {
    const { updateProfile, route, verified, profile } = this.props
    const isRegistration: boolean = !!route.params?.registration
    const {
      first_name,
      country_code,
      last_name,
      birthday,
      gender,
      confirm,
      phone,
      email,
      newPhoto,
      photo_id,
      isAgreementAccepted,
      saveButtonDisabled,
      first_name_apple,
      last_name_apple,
      first_name_yandex,
      last_name_yandex,
      yandex_id,
    } = this.state

    if (
      (!verified || !isAgreementAccepted) &&
      isRegistration &&
      (profile?.googleIdToken || profile?.apple_id || profile?.yandex_id)
    )
      if (!verified) {
        showMessage({
          type: 'danger',
          message: 'Нужно подтвердить ваш номер телефона',
          duration: 5000,
        })
        return
      } else if (!isAgreementAccepted) {
        showMessage({
          type: 'danger',
          message: 'Необходимо согласиться с политикой',
          duration: 5000,
        })
        return
      }

    const registrationDetail: any = {
      isRegistration,
      first_name: isRegistration ? first_name_apple || first_name_yandex || first_name : first_name,
      last_name: isRegistration ? last_name_apple || last_name_yandex || last_name : last_name,
      birthday,
      confirm,
      phone: `${+country_code?.slice(1)}${phone}`,
      email: email ? email : undefined,
      newPhoto,
      photo_id,
      first_name_apple,
      last_name_apple,
      yandex_id,
    }

    if (isRegistration) {
      AppMetrica.reportEvent('registration', { registrationDetail })
    }

    this.setState({ saveButtonDisabled: true }) //временное решение
    setTimeout(() => {
      this.setState({ saveButtonDisabled: false })
    }, 500)
    updateProfile(registrationDetail)
  }

  onCancelEditProfile = () => {
    const { navigation, route, logout } = this.props
    const isRegistration: boolean = !!route.params?.registration
    if (isRegistration) {
      logout()
    } else {
      navigation.goBack()
    }
  }

  onBirthdayPress = () => {
    this.setState({ showDatePickerModal: true })
  }

  onBirthdayChange = (date: Date) => {
    this.setState({
      showDatePickerModal: false,
      birthday: moment(date).format('YYYY-MM-DD'),
    })
  }
  onLinkPress = (link: string) => {
    const { country, navigation } = this.props
    const agreement = country.documents.find((el) => el.type === link)

    if (agreement) {
      navigation.navigate('AgreementScreen', { agreement })
    }
  }

  onCarPress = (car?: CarType) => {
    const { navigation } = this.props
    navigation.navigate('CarEditScreen', { car })
  }

  onPressGoMain = () => {
    this.props.getProfile()
  }
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  profile: state.user.profile,
  profile_registration_google: state.user.profile_registration_google,
  hasProfile: state.user.hasProfile,
  fetching: state.user.fetching,
  error: state.user.error,
  error_login: state.auth.error,
  verified: state.auth.verified,
  fetching_login: state.auth.fetching,
  cars: state.cars.cars,
  token: state.auth.token,
  countries: state.countries.countries,
  country: state.countries.country,
})

const mapDispatchToProps = {
  updateProfile: userProfileUpdateAction,
  sendCode: authRequestGoogleCheckAction,
  getCars: carsRequestAction,
  getProfile: userProfileRequestAction,
  logout: authLogoutRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen)

const commonStyles = {
  questionStyle: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  } as TextStyle,
}

const styles = {
  container: {
    ...ScreenStyles,
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  } as ViewStyle,
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
  codeInput: {
    marginTop: 25,
    alignItems: 'center',
  } as ViewStyle,
  inputSecondField: {
    // marginTop: isSmallScreen() ? 8 : 10,
    marginTop: 10,
    flex: 1,
  } as ViewStyle,
  questionMargins: {
    marginTop: 33,
    marginBottom: 16,
  } as ViewStyle,
  whatIsNameStyle: {
    ...commonStyles.questionStyle,
    marginTop: isSmallScreen() ? 32 : 40,
  } as TextStyle,
  questionStyle: {
    ...commonStyles.questionStyle,
  } as TextStyle,
  notRequired: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  box: {
    // width: isSmallScreen() ? 80 : 110,//FOR WHATSAPP
    width: isSmallScreen() ? 116 : 160, //FOR WHATSAPP
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  addCar: {
    marginTop: 16,
  } as ViewStyle,
  confirmationText: {
    marginTop: 10,
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
  } as ViewStyle,
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
  } as ViewStyle,
  buttonOptions: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    alignSelf: 'center',
  } as ViewStyle,
  flexRow: {
    flexDirection: 'row',
  } as ViewStyle,
  codeCountryInput: {
    marginTop: 10,
    width: 80,
  },
  containerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  datepicker: {} as ViewStyle,
  border: {
    borderWidth: 1,
    borderRadius: 2,
  } as ViewStyle,
}
