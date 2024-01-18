import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  TextInput as RNTextInput,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  TouchableOpacity,
  LayoutChangeEvent,
  Animated,
  LayoutRectangle,
  Text,
  Platform,
} from 'react-native'
import { Icon } from '../../components'
import { useTheme } from '@react-navigation/native'
import { getFormatedPhoneNumber } from '../../services'
import { font } from '../../theme'
import { Nullable } from '../../types'
import config from '../../config'
import { SvgUri } from 'react-native-svg'

export interface TextInputProps {
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
  type?: 'phone' | 'password' | 'email' | 'citySuggest' | 'carBrandSuggest' | 'carModelSuggest' | 'countryList'
  value?: string
  placeholder?: string
  animatedPlaceholder?: boolean
  countryCode?: number
  onChange?: (value: string) => void
  maxLength?: number
  keyboardType?: KeyboardTypeOptions
  multiline?: boolean
  onBlur?: () => void
  editable?: boolean
  onPressIn?: () => void
  autoFocus?: boolean
  caretHidden?: boolean
  visibleIcon?: boolean
  error?: Nullable<string | boolean>
  debug?: boolean
  backgroundColor?: string
  borderColor?: string
  searchInPlace?: string
  getRef?: (ref: React.MutableRefObject<RNTextInput>) => void
}

export default function TextInput(props: TextInputProps) {
  const {
    style,
    textStyle,
    type,
    countryCode,
    onChange,
    multiline,
    onBlur,
    editable = true,
    onPressIn,
    autoFocus = false,
    caretHidden,
    animatedPlaceholder = false,
    error,
    debug,
    backgroundColor,
    searchInPlace,
    getRef,
    borderColor,
  } = props
  let { value, placeholder, keyboardType, maxLength } = props

  const { colors } = useTheme()
  const [isFocused, setFocus] = useState(autoFocus)
  const inputRef = useRef<Nullable<RNTextInput>>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [securePassword, setSecurePassword] = useState(true)
  const placeholderPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  const placeholderResize = useRef(new Animated.Value(0)).current
  const inputPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  const [inputLayout, setInputLayout] = useState<Nullable<LayoutRectangle>>(null)
  const [inputWrapperLayout, setInputWrapperLayout] = useState<Nullable<LayoutRectangle>>(null)
  const [placeholderLayout, setPlaceholderLayout] = useState<Nullable<LayoutRectangle>>(null)

  if (type == 'phone') {
    if (!placeholder) {
      placeholder = `+${countryCode} (999) 999-99-99`
    }
    value = isFocused || !!value ? getFormatedPhoneNumber(countryCode, value || '') : undefined
    keyboardType = 'phone-pad'
    const countryCodeString = countryCode.toString()
    maxLength = countryCodeString.length > 2 ? countryCodeString.length + 17 : countryCodeString.length + 18
  }

  const iconName = showPassword ? 'inputTextVisible' : 'inputTextHiden'
  const passwordVisible = type === 'password' ? securePassword : false

  const showPlaceholder = !!placeholder && !!inputLayout && (animatedPlaceholder || (!animatedPlaceholder && !value))
  const isPlaceholderTopPosition = showPlaceholder && (!!value || isFocused)

  const placeholderMaxScale = 1
  const placeholderMinScale = 0.72
  const placeholderTopY = 5
  const placeholderX = (inputWrapperLayout?.x || 0) - 1
  const placeholderY = multiline
    ? (inputLayout?.y || 0) + (Platform.OS === 'android' ? 1 : 5)
    : (inputLayout?.y || 0) + ((inputLayout?.height || 0) - (placeholderLayout?.height || 0)) / 2
  const placeholderTopX =
    placeholderX - ((placeholderLayout?.width || 0) - (placeholderLayout?.width || 0) * placeholderMinScale) / 2
  const isPlaceholderVisible = !!inputLayout && !!inputWrapperLayout && !!placeholderLayout

  useEffect(() => {
    if (!!inputRef && !!getRef) {
      getRef(inputRef)
    }
  }, [inputRef])

  useEffect(() => {
    if (animatedPlaceholder && showPlaceholder && !!placeholderLayout) {
      Animated.timing(placeholderPosition, {
        toValue: {
          x: isPlaceholderTopPosition ? placeholderTopX : inputWrapperLayout.x,
          y: isPlaceholderTopPosition ? placeholderTopY : placeholderY,
        },
        duration: config.animationDuration,
        useNativeDriver: true,
      }).start()
      Animated.timing(placeholderResize, {
        toValue: isPlaceholderTopPosition ? placeholderMinScale : placeholderMaxScale,
        duration: config.animationDuration,
        useNativeDriver: true,
      }).start()
      Animated.timing(inputPosition, {
        toValue: {
          x: inputLayout.x,
          y: isPlaceholderTopPosition ? 8 : 0,
        },
        duration: config.animationDuration,
        useNativeDriver: true,
      }).start()
    }
  }, [isPlaceholderTopPosition])

  const onTextInputLayout = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout
    if (!inputLayout || inputLayout.width < layout.width) {
      setInputLayout(layout)
    }
  }

  const onTextInputWrapperLayout = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout
    if (!inputWrapperLayout || inputWrapperLayout.width < layout.width) {
      setInputWrapperLayout(layout)
    }
  }

  const onPlaceholderLayout = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout
    if (!placeholderLayout || placeholderLayout?.width < layout.width) {
      setPlaceholderLayout(e.nativeEvent.layout)
    }
  }

  useEffect(() => {
    if (!!inputLayout && !!inputWrapperLayout && !!placeholderLayout) {
      debug &&
        console.log(Platform.OS, {
          isPlaceholderTopPosition,
          value,
          multiline,
          placeholderX,
          placeholderY,
          placeholderTopX,
          placeholderTopY,
          inputLayout,
          inputWrapperLayout,
          placeholderLayout,
        })

      if (isPlaceholderTopPosition) {
        placeholderPosition.setValue({
          x: placeholderTopX,
          y: placeholderTopY,
        })
        inputPosition.setValue({
          x: inputLayout.x,
          y: placeholderLayout.height / 2,
        })
        placeholderResize.setValue(placeholderMinScale)
      } else {
        placeholderPosition.setValue({
          x: placeholderX,
          y: placeholderY,
        })
        placeholderResize.setValue(placeholderMaxScale)
      }
    }
  }, [inputLayout, inputWrapperLayout, placeholderLayout])

  const onChangeText = (text: string) => {
    if (type === 'phone') {
      const countryMask = `+${countryCode} (`
      if (text.length < countryMask.length) {
        text = countryMask
      }
      text = text.replace(/^[0-9]/g, '')
      inputRef.current.setNativeProps({ text })
    }
    !!onChange && onChange(type == 'phone' ? getValue(countryCode, value, text) : text)
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.rowView,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor ? borderColor : isFocused ? colors.textInput.border : colors.textInput.background,
            borderWidth: 1,
            borderBottomWidth: error ? 2 : 1,
            borderBottomColor: error ? colors.textInput.error : undefined,
            paddingHorizontal: multiline ? 16 : 20,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.animatedRowView,
            {
              transform: [{ translateX: inputPosition.x }, { translateY: inputPosition.y }],
            },
          ]}
          onLayout={onTextInputWrapperLayout}
        >
          {type === 'countryList' ? (
            <View style={[styles.container, { marginTop: 5 }]}>
              <SvgUri uri={`https://xn--90aagsb.xn--p1ai/${value}`} width={35} height={35} />
            </View>
          ) : (
            <RNTextInput
              caretHidden={caretHidden}
              autoFocus={autoFocus}
              onPressIn={onPressIn}
              editable={editable}
              testID={'TextInput_Input'}
              ref={inputRef}
              style={[
                styles.text,
                {
                  color: colors.text.default,
                  textAlignVertical: multiline ? 'top' : 'center',
                  minHeight: multiline ? +styles.rowView.minHeight * 1.6 : undefined,
                  marginVertical: multiline ? 16 : undefined,
                },
                textStyle,
              ]}
              value={value}
              keyboardType={keyboardType}
              onFocus={() => setFocus(true)}
              onBlur={() => {
                onBlur && onBlur()
                setFocus(false)
              }}
              onChangeText={onChangeText}
              maxLength={maxLength}
              multiline={multiline}
              secureTextEntry={passwordVisible}
              onLayout={onTextInputLayout}
            />
          )}
          {!!value && type === 'password' && (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                setShowPassword(!showPassword)
                setSecurePassword(!securePassword)
              }}
            >
              <Icon color={colors.icon.secondary} name={iconName} />
            </TouchableOpacity>
          )}
          {['citySuggest', 'carBrandSuggest', 'carModelSuggest'].includes(type) && searchInPlace === undefined && (
            <Icon name={'dropdown'} style={styles.dropdown} color={colors.icon.secondary} />
          )}
        </Animated.View>
        {showPlaceholder && (
          <Animated.View
            testID={'TextInput_Placeholder'}
            style={[
              styles.placeholderContainer,
              {
                width: inputLayout.width - 2 * inputLayout.x,
                height: multiline ? '100%' : undefined,
                transform: [{ translateX: placeholderPosition.x }, { translateY: placeholderPosition.y }],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.placeholder,
                {
                  color: colors.text.placeholder,
                  transform: [{ scale: placeholderResize }],
                },
              ]}
              onLayout={onPlaceholderLayout}
            >
              {isPlaceholderVisible && placeholder}
            </Animated.Text>
          </Animated.View>
        )}
      </View>
      {typeof error === 'string' && <Text style={[styles.error, { color: colors.textInput.error }]}>* {error}</Text>}
    </View>
  )
}

const styles = {
  container: {} as ViewStyle,
  text: {
    flex: 1,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    padding: 0,
  } as TextStyle,
  icon: {
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  rowView: {
    overflow: 'hidden',
    minHeight: 50,
    borderRadius: 2,
  } as ViewStyle,
  animatedRowView: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,
  placeholderContainer: {
    position: 'absolute',
    zIndex: -1,
  } as ViewStyle,
  placeholder: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 18,
    height: 18,
    flex: 1,
  } as TextStyle,
  error: {
    marginVertical: 8,
    fontFamily: font(),
    fontSize: 11,
  } as TextStyle,
  dropdown: {
    alignSelf: 'center',
  } as ViewStyle,
  top: {
    flex: 0.3,
    backgroundColor: 'grey',
    borderWidth: 5,
  },
}

export function getValue(countryCode: number, prevValue: string, newValue: string) {
  if (newValue?.length < prevValue?.length) {
    const result = format(countryCode, prevValue)
    return result.substring(0, result.length - 1)
  } else {
    return format(countryCode, newValue)
  }
}

function format(countryCode: number, value: string) {
  return value.replace(/[^0-9]/g, '').substring(countryCode.toString().length)
}
