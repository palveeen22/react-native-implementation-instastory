import React, { useEffect, useState } from 'react'
import { ViewStyle, View, Linking } from 'react-native'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Screen, Alert, ListItem, ListItemProps } from '../components/'
import { authLogoutRequestAction } from '../store/redux/auth'
import { userProfileDeleteRequestAction, userProfileRequestAction } from '../store/redux/user'
import { t } from '../localization'
import moment from 'moment'
import 'moment/locale/ru'
import CustomModal from '../components/ModalCustomize'

moment().locale('ru')

type ScreenProps = DispatchProps & StateProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

interface Props extends ScreenProps { }

interface Props {
  getProfile: () => void
  route: {
    params: {
      screenName: (arg: string) => void
      notificationsCount: number
    }
  }
}

const ProfileScreen: React.FC<Props> = ({ getProfile, route, navigation, logout, profile, deleteProfile, token }) => {
  useEffect(() => {
    const { screenName } = route.params
    screenName('ProfileScreen')
    getProfile()
  }, [getProfile, route.params])

  const [modalVisible, setModalVisible] = useState(false)
  const [isLogout, setIsLogout] = useState(false)

  const openModal = (isLogout: boolean) => {
    setModalVisible(true)
    setIsLogout(isLogout)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const getMenu = (): ListItemProps[] => [
    // { text: t('notifications'), onPress: this.onNotificationsPress },
    // { text: t('notification_settings'), onPress: this.onNotificationSettingsPress },
    { text: t('agreements'), onPress: onAgreementsPress },
    { text: t('chat_support'), onPress: onChatSupportPress },
    // { text: t('documents'), onPress: onDocumentsPress },
    { text: t('logout'), onPress: () => openModal(true) },
    { text: t('delete_profile'), onPress: () => openModal(false) },
  ]

  const onRightIconPress = () => {
    Alert.alert('onRightIconPress', [
      { text: 'ok', onPress: () => null },
      { text: 'cancel', onPress: () => null },
    ])
  }

  const onEditProfilePress = () => {
    navigation.navigate('ProfileStack', { screen: 'ProfileEditScreen' })
  }

  const onNotificationsPress = () => {
    navigation.navigate('NotificationsScreen')
  }

  const onNotificationSettingsPress = () => {
    navigation.navigate('Main', {
      screen: 'ProfileStack',
      params: {
        screen: 'NotificationSettingsScreen',
      },
    })
  }

  const onAgreementsPress = () => {
    navigation.navigate('AgreementsScreen')
  }

  const onDocumentsPress = () => {
    navigation.navigate('DocumentsScreen')
  }

  const onChatSupportPress = () => {
    const telegramBotUrl = 'https://t.me/bibigsupport_bot' // Replace with your Telegram bot URL
    Linking.openURL(telegramBotUrl).catch((error) => {
      console.error('Error opening Telegram bot:', error)
    })
  }

  const { notificationsCount } = route.params

  return (
    <Screen
      title={t('profile')}
      hideGoBack
      // rightIconName={'message'}
      onRightIconPress={onRightIconPress}
      badge={notificationsCount}
      contentContainerStyle={styles.container}
    >
      <ListItem userProfile profile={profile} text={t('your_profile')} onPress={onEditProfilePress} />
      <View style={styles.menuContainer}>
        {getMenu().map((item, index) => (
          <ListItem key={index.toString()} text={item.text} onPress={item.onPress} />
        ))}
      </View>
      <CustomModal
        visible={modalVisible}
        onClickFirst={() => {
          if (isLogout) {
            logout(token)
          } else {
            deleteProfile()
          }
        }}
        onClickSecond={closeModal}
        title={isLogout ? t('logout_confirm') : t('delete_profile_confirm')}
        textFirst={isLogout ? t('yes_logout') : t('yes_delete')}
        textSecond={t('cancel')}
      />
    </Screen>
  )
}

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
  profile: state.user.profile,
})

const mapDispatchToProps = {
  logout: authLogoutRequestAction,
  getProfile: userProfileRequestAction,
  deleteProfile: userProfileDeleteRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = {
  container: {
    paddingHorizontal: 16,
  } as ViewStyle,
  menuContainer: {
    marginTop: 10,
  } as ViewStyle,
}
