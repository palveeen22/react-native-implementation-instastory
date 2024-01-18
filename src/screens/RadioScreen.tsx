import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { TextStyle, ViewStyle } from 'react-native'
import { Screen, Switch } from '../components'
import { Translation } from '../localization'
import { ThemeColors } from '../theme'
import { appDeviceThemeAction, appThemeAction } from '../store/redux/app'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {}

const RadioScreen: React.FC<Props> = ({ isDeviceTheme, theme, setDeviceTheme, setTheme }) => {
  const word: Translation = 'registered_more_years'
  return (
    <Screen title={'RadioScreen'} contentContainerStyle={styles.contentContainer} hideGoBack>
      <Switch
        style={{ marginBottom: 15 }}
        type={'checkbox'}
        selected={isDeviceTheme}
        onChange={() => setDeviceTheme(!isDeviceTheme)}
        rightText={'Тема устройства'}
      />
      <Switch
        style={{ marginBottom: 15 }}
        type={'radiobutton'}
        selected={theme === 'light'}
        onChange={() => setTheme('light')}
        rightText={'Светлая'}
      />
      <Switch
        style={{ marginBottom: 15 }}
        type={'radiobutton'}
        selected={theme === 'dark'}
        onChange={() => setTheme('dark')}
        rightText={'Темная'}
      />
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  theme: state.app.theme,
  isDeviceTheme: state.app.deviceTheme,
})

const mapDispatchToProps = {
  setDeviceTheme: appDeviceThemeAction,
  setTheme: appThemeAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(RadioScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
  input: {
    marginBottom: 15,
  } as ViewStyle,
  textStyle: {
    backgroundColor: 'yellow',
    opacity: 0.5,
  } as TextStyle,
}
