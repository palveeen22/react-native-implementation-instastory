import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, Text, TextStyle, View, ViewStyle, ActivityIndicator, TouchableOpacity, Linking } from 'react-native'
import { Screen, CodeInput, Timer } from '../components'
import { t } from '../localization'
import { ThemeColors, font } from '../theme'
import { authRequestAction, authRequestTelegramAction } from '../store/redux/auth'
import config from '../config'
import LottieView from 'lottie-react-native'
import animationData from './loading_light_mode.json'
import animationDataDark from './loading_dark_mode.json'
import { useTheme } from '@react-navigation/native'

// import useTimer from '../hooks/useTimer'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type CodeConfirmScreenProps = ScreenProps & StateProps & {}

const CodeConfirmScreenFC: React.FC<CodeConfirmScreenProps> = ({
  phone,
  fetching,
  error,
  route,
  sendCode,
  sendCodeTelegram,
}) => {
  const [countdown, setCountdown] = useState<number>(config.timerDuration)
  const [codeError, setCodeError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { dark } = useTheme()
  const isFromTelegram: boolean = route.params.fromTelegram
  const token = useSelector((state: AppState) => state.auth.token)

  useEffect(() => {
    const phone: string = route.params?.phone
    // if (!isFromTelegram) {
    //   sendCode({ phone })
    // }
    if (!isFromTelegram) {
      sendCode({ phone })
    } else {
      sendCodeTelegram({ phone })
    }
  }, [])

  useEffect(() => {
    if (!fetching && !!error) {
      setCodeError(true)
    }
  })

  useEffect(() => {
    if (!fetching && !!error) {
      setIsLoading(false)
      setCodeError(true)
    }
  }, [fetching, error])

  const colors: ThemeColors = route.params?.colors

  const resendCode = () => {
    sendCode({ phone })
    setCountdown(-1)
    setCodeError(false)
  }

  const onCodeEntered = (code: string) => {
    if (!code) {
      return
    }
    setIsLoading(true)
    setCodeError(false)
    sendCode({ phone, code })
    // if (!isFromTelegram) {
    //   sendCode({ phone, code })
    // } else {
    //   sendCodeTelegram({ phone, code })
    // }
  }

  const onLoginTelegram = () => {
    const telegramBotUrl = 'https://t.me/Bibig_Trip_Bot'; // Replace with your Telegram bot URL
    Linking.openURL(telegramBotUrl).
      catch((error) => {
        // Handle error if the Telegram app is not installed or if URL cannot be opened
        console.error('Error opening Telegram bot:', error);
      });
  }
  return (
    <Screen title={t('login_registration')} contentContainerStyle={styles.contentContainer}>
      <View>
        <Text style={[styles.secondaryTextStyle, { color: colors.text.default }]}>
          {!isLoading
            ? `${t(isFromTelegram ? 'sent_code_your_phone_telegram' : 'sent_code_your_phone')} +${phone ?? ''} ${isFromTelegram ? t('sent_code_your_phone_telegram_two') : ''
            }`
            : ''}
        </Text>
        <View style={styles.resend.container}>
          {isLoading ? (
            <View style={{ textAlign: 'center' }}>
              <LottieView
                source={!dark ? animationData : animationDataDark}
                autoPlay
                loop
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            </View>
          ) : (
            <>
              <CodeInput
                style={styles.codeInput}
                onCodeEntered={onCodeEntered}
                error={codeError}
                onChange={() => setCodeError(false)}
              />
              {isFromTelegram ? (
                <TouchableOpacity onPress={onLoginTelegram}>
                  <Text style={[styles.resend.placeholder, { color: colors.text.secondary }]}>
                    {t('repeat_request_code_telegram')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  {countdown === 0 ? (
                    <Pressable onPress={resendCode}>
                      <Text style={[styles.resend.action, { color: colors.text.action }]}> {t('code_not_come')}</Text>
                    </Pressable>
                  ) : (
                    <>
                      <Text style={[styles.resend.placeholder, { color: colors.text.secondary }]}>
                        {t('repeat_send_code', [countdown])}
                      </Text>
                      <Timer duration={config.timerDuration} onTick={(c) => setCountdown(c)} />
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </View>
      {/* {isFromTelegram ? (
        <View>
          <TouchableOpacity
            onPress={() => {
              const phone: string = route.params?.phone
              sendCodeTelegram({ number: phone })
            }}>
            <Text style={[styles.secondaryTextStyle, { color: colors.text.default }]}>
              {t('check_telegram')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={[styles.secondaryTextStyle, { color: colors.text.default }]}>
            {!isLoading ? `${t('sent_code_your_phone')} +${phone ?? ''}` : ''}
          </Text>
          <View style={styles.resend.container}>
            {isLoading ? (
              <View style={{ textAlign: 'center' }}>
                <LottieView
                  source={!dark ? animationData : animationDataDark}
                  autoPlay
                  loop
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
              </View>
            ) : (
              <>
                <CodeInput
                  style={styles.codeInput}
                  onCodeEntered={onCodeEntered}
                  error={codeError}
                  onChange={() => setCodeError(false)}
                />
                {countdown === 0 ? (
                  <Pressable onPress={resendCode}>
                    <Text style={[styles.resend.action, { color: colors.text.action }]}> {t('code_not_come')}</Text>
                  </Pressable>
                ) : (
                  <>
                    <Text style={[styles.resend.placeholder, { color: colors.text.secondary }]}>
                      {t('repeat_send_code', [countdown])}
                    </Text>
                    <Timer duration={config.timerDuration} onTick={(c) => setCountdown(c)} />
                  </>
                )}
              </>
            )}
          </View>
        </View>
      )} */}
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  phone: state.auth.phone,
  fetching: state.auth.fetching,
  error: state.auth.error,
})

const mapDispatchToProps = {
  sendCode: authRequestAction,
  sendCodeTelegram: authRequestTelegramAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeConfirmScreenFC)

const commonStyles = {
  resend: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    paddingTop: 15,
  } as TextStyle,
}

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,

  secondaryTextStyle: {
    marginTop: 154,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
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
