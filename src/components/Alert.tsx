import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Nullable } from '../types'
import { font } from '../theme'

interface AlertProps {
  message?: string
  buttons?: [AlertButton, AlertButton]
  options?: AlertOptions
  onClose?: () => void
}

interface AlertOptions {
  cancelable?: boolean
  onDismiss?: () => void
  textPosition?: 'left' | 'center'
}

interface State {
  message: Nullable<string>
  buttons: Nullable<[AlertButton, AlertButton]>
  options: Nullable<AlertOptions>
}

interface AlertButton {
  text: string
  onPress?: (value: string) => void
  param?: string
}

const initialState: State = {
  message: null,
  buttons: null,
  options: null,
}

export default class Alert extends React.Component<{}, State> {
  private static AlertInstance
  constructor(props: {}) {
    super(props)
    this.state = {
      ...initialState,
    }
    Alert.AlertInstance = this
  }

  render() {
    const { message, buttons, options } = this.state

    return <_Alert message={message} buttons={buttons} options={options} onClose={this.onClose} />
  }

  static alert(message?: string, buttons?: AlertButton[], options?: AlertOptions) {
    Alert.AlertInstance._alert(message, buttons, options)
  }

  _alert(message: string, buttons: [AlertButton, AlertButton], options: AlertOptions) {
    this.setState({ message, buttons, options })
  }

  onClose = () => {
    const { options } = this.state
    const { onDismiss = () => null } = options || {}
    this.setState(initialState)
    onDismiss()
  }
}

export function _Alert({ message, buttons, options, onClose }: AlertProps) {
  const { colors } = useTheme()

  const visible = !!message
  const { cancelable = true } = options || {}
  return (
    <Modal testID={'Alert_Modal'} visible={visible} transparent>
      <TouchableOpacity
        testID={'Alert_Modal_Backdrop'}
        activeOpacity={1}
        style={[styles.wrapper, { backgroundColor: colors.alert.wrapper }]}
        onPress={cancelable ? onClose : undefined}
      >
        <View style={[styles.container, { backgroundColor: colors.alert.background }]}>
          <Text
            style={[
              styles.message,
              {
                color: colors.text.default,
                textAlign: options?.textPosition || 'center',
              },
            ]}
          >
            {message}
          </Text>
          {!!buttons?.length && (
            <View style={[styles.buttonsContainer, { borderColor: colors.alert.border }]}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={1}
                  style={[styles.button, index === 1 && { borderLeftWidth: 1 }, { borderColor: colors.alert.border }]}
                  onPress={() => {
                    onClose()
                    !!button.onPress && button.onPress(button.param)
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      index === 1 && { fontFamily: font(600) },
                      { color: colors.alert.buttonText },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 14,
  },
  message: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: font(600),
    marginVertical: 24,
    marginHorizontal: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: font(),
  },
})
