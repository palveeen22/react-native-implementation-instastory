import React, { useState } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ViewStyle } from 'react-native'
import { Screen, ScreenStyles, Switch } from '../components'
import { t } from '../localization'
import { ThemeColors } from '../theme'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

const NotificationSettingsScreen: React.FC<Props> = ({ route }) => {
  const [push, setPush] = useState<boolean>(true)
  const [mail, setMail] = useState<boolean>(true)
  const [sms, setSMS] = useState<boolean>(true)

  const colors: ThemeColors = route.params.colors

  return (
    <Screen title={t('notification_settings')} contentContainerStyle={[ScreenStyles, styles.contentContainer]}>
      <View style={[styles.container, { borderColor: colors.border }]}>
        <Switch
          style={[styles.switcher, { borderColor: colors.border }]}
          leftText={t('push_notifications')}
          type={'switch'}
          onChange={(p) => setPush(p)}
          selected={push}
        />
        <Switch
          style={[styles.switcher, { borderColor: colors.border }]}
          leftText={t('mail_notifications')}
          type={'switch'}
          onChange={(m) => setMail(m)}
          selected={mail}
        />
        <Switch
          style={[styles.switcher, { borderColor: colors.border }]}
          leftText={t('sms_notifications')}
          type={'switch'}
          onChange={(s) => setSMS(s)}
          selected={sms}
        />
      </View>
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettingsScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
  container: {
    borderTopWidth: 1,
  } as ViewStyle,
  switcher: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  } as ViewStyle,
}
