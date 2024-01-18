import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, ViewStyle, TextStyle, ScrollView } from 'react-native'
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
} from '../components'
import { t } from '../localization'
import { ThemeColors, font, isSmallScreen } from '../theme'
import moment from 'moment'
import 'moment/locale/ru'
moment().locale('ru')
import { CarType, GenderType, Nullable, PickedFileType } from '../types'
import { userProfileRequestAction, userProfileUpdateAction } from '../store/redux/user'
import { carsRequestAction } from '../store/redux/cars'
import { authLogoutRequestAction } from '../store/redux/auth'
import { getScrollOffset } from '../services'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

const ProfileEditScreen: React.FC<Props> = ({
  profile,
  getCars,
  route,
  navigation,
  fetching,
  error,
  cars,
  getProfile,
  logout,
  updateProfile,
}) => {
  const [firstName, setFirstName] = useState<Nullable<string>>(profile.first_name ?? null)
  const [lastName, setLastName] = useState<Nullable<string>>(profile.last_name ?? null)
  const [birthday, setBirthday] = useState<Nullable<string>>(profile.birthday ?? null)
  const [gender, setGender] = useState<Nullable<GenderType>>(profile.gender ?? null)
  const [confirm, setConfirm] = useState<boolean>(profile.confirm ?? false)
  const [phone, setPhone] = useState<Nullable<string>>(profile.phone ?? null)
  const [email, setEmail] = useState<Nullable<string>>(profile.email ?? null)
  const [photo, setPhoto] = useState<Nullable<string>>(profile.photo ?? null)
  const [newPhoto, setNewPhoto] = useState<Nullable<PickedFileType>>(null)
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false)
  const [photoId, setPhotoId] = useState<Nullable<number>>(profile.photo_id ?? null)
  const [showRegistrationSuccessModal, setShowRegistrationSuccessModal] = useState<boolean>(false)
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(false)

  useEffect(() => {
    const { screenName } = route.params
    navigation.addListener('beforeRemove', () => {
      screenName('ProfileScreen')
    })

    return () => {
      navigation.removeListener('beforeRemove', () => { })
    }
  }, [])

  useEffect(() => {
    if (!fetching && !error) {
      const isRegistration: boolean = !!route.params?.registration
      if (isRegistration) {
        setShowRegistrationSuccessModal(true)
      } else {
        navigation.goBack()
      }
    }
  }, [fetching, error])

  const colors: ThemeColors = route.params.colors

  const isRegistration: boolean = !!route.params?.registration
  const currentDate = moment() // Get the current date
  const eighteenYearsAgo = currentDate.subtract(18, 'years') // Subtract 18 years from the current date

  const onAddFiles = (newPh: PickedFileType) => {
    setNewPhoto(newPh)
    setPhoto(null)
    setPhotoId(null)
  }

  const onSaveProfile = () => {
    setSaveButtonDisabled(true) // временное решение
    setTimeout(() => {
      setSaveButtonDisabled(false)
    }, 500)
    updateProfile({
      isRegistration,
      first_name: firstName,
      last_name: lastName,
      birthday,
      confirm,
      phone: `7${phone}`,
      email: email ? email : undefined,
      newPhoto,
      photo_id: photoId,
    })
  }

  const onCancelEditProfile = () => {
    if (isRegistration) {
      logout()
    } else {
      navigation.goBack()
    }
  }

  const onBirthdayPress = () => {
    setShowDatePickerModal(true)
  }

  const onBirthdayChange = (date: Date) => {
    setShowDatePickerModal(false)
    setBirthday(moment(date).format('YYYY-MM-DD'))
  }

  const onCarPress = (car?: CarType) => {
    navigation.navigate('CarEditScreen', { car })
  }

  const onPressGoMain = () => {
    getProfile()
  }

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
        onScroll={(e) => setScrollOffset(getScrollOffset(e))}
        scrollEventThrottle={1}
        onContentSizeChange={(w, cH) => setContentHeight(contentHeight)}
      >
        <ImagePicker style={styles.avatar} size={88} image={newPhoto?.uri || photo} onImageChange={onAddFiles} />

        <Text style={[styles.questionMargins, styles.whatIsNameStyle, { color: colors.text.title }]}>
          {t('what_is_you_name')}
        </Text>
        <TextInput onChange={(e) => setFirstName(e)} value={firstName} placeholder={t('name')} animatedPlaceholder />
        <TextInput
          onChange={(e) => setLastName(e)}
          style={styles.inputSecondField}
          value={lastName}
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
            value={birthday ? moment(birthday).format('DD MMMM YYYY') : moment(eighteenYearsAgo).format('DD MMMM YYYY')}
            editable={false}
            onChange={() => null}
            placeholder={t('birthday')}
            onPress={onBirthdayPress}
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
        <TextInput onChange={(e) => setEmail(e)} placeholder={t('email')} value={email} />
        <TextInput
          onChange={(e) => setPhone(e)}
          type={'phone'}
          style={styles.inputSecondField}
          placeholder={t('telephone')}
          value={phone}
          countryCode={7}
          editable={false}
        />

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
              onPress={() => onCarPress(car)}
            />
          ))}
        </View>

        <Selector style={styles.addCar} text={t('add_car')} onPress={() => onCarPress()} selected icon={'plus_large'} />
      </ScrollView>
      <View style={[styles.buttonContainer]}>
        <Button style={styles.button} text={t('cancel')} onPress={onCancelEditProfile} type={'secondary'} />
        <Button
          disabled={saveButtonDisabled}
          style={[styles.button, { marginLeft: 8 }]}
          text={t('save')}
          onPress={onSaveProfile}
          type={'primary'}
        />
      </View>

      <DatePicker
        modal
        mode={'date'}
        maximumDate={new Date(moment().add(-18, 'years').format('YYYY-MM-DDT00:00:00+00:00'))}
        isVisible={showDatePickerModal}
        date={new Date(birthday || new Date(moment().add(-18, 'years').format('YYYY-MM-DDT00:00:00+00:00')))}
        onConfirm={onBirthdayChange}
        onCancel={() => setShowDatePickerModal(false)}
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
            onPress: onPressGoMain,
          },
        ]}
      />
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  profile: state.user.profile,
  fetching: state.user.fetching,
  error: state.user.error,
  cars: state.cars.cars,
})

const mapDispatchToProps = {
  updateProfile: userProfileUpdateAction,
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
  inputSecondField: {
    marginTop: isSmallScreen() ? 8 : 10,
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
  } as ViewStyle,
  avatar: {
    alignSelf: 'center',
  } as ViewStyle,
  flexRow: {
    flexDirection: 'row',
  } as ViewStyle,
  datepicker: {} as ViewStyle,
  border: {
    borderWidth: 1,
    borderRadius: 2,
  } as ViewStyle,
}
