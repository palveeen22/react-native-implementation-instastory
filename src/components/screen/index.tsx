import React, { ReactElement, useState, useEffect, useRef } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import {
  View,
  StatusBar,
  ViewStyle,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import Header from './Header'
import { isSmallScreen } from '../../theme'
import { IconsType } from '../Icon'
import { getScrollOffset, getTabBarVisible } from '../../services'
import { Nullable } from '../../types'
import BackgroundImage from './BackgroundImage'

export { BackgroundImage }

interface ScreenProps {
  children?: ReactElement<any, any> | ReactElement<any, any>[]
  hideHeader?: boolean
  title?: string
  hideGoBack?: boolean
  onGoBackPress?: () => void
  fetching?: boolean
  style?: ViewStyle
  headerStyle?: ViewStyle
  safeArea?: boolean
  leftIconName?: IconsType
  rightIconName?: IconsType
  onRightIconPress?: () => void
  scrollOffset?: number
  step?: [number, number]
  enableScroll?: boolean
  badge?: number | boolean
  contentContainerStyle?: ViewStyle | ViewStyle[]
  contentHeight?: number
  reachBottom?: boolean
}

export default function ({
  children,
  hideHeader,
  title,
  hideGoBack,
  onGoBackPress,
  fetching,
  headerStyle,
  safeArea = true,
  leftIconName = 'chevronLeft',
  rightIconName,
  onRightIconPress,
  scrollOffset,
  step,
  enableScroll = true,
  badge,
  contentContainerStyle,
  contentHeight,
  reachBottom
}: ScreenProps) {
  const { dark, colors } = useTheme()
  const navigation = useNavigation()

  const isTabBarVisible = useRef(getTabBarVisible()).current
  const [showTabBar, setShowTabBar] = useState<boolean>(false)
  const [innerScrollOffset, setInnerScrollOffset] = useState<Nullable<number>>(null)
  const [backgroundImageHeight, setBackgroundImageHeight] = useState<null | number>(null)

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      setShowTabBar(true)
    })

    if (scrollOffset !== undefined || innerScrollOffset !== undefined) {
      navigation.navigate('Main', { showTabBar })
    }
  }, [showTabBar])

  useEffect(() => {
    //IF IT HIT
    if (reachBottom) {
      setShowTabBar(true)
    }

    const _scrollOffset = scrollOffset || innerScrollOffset
    if (_scrollOffset !== undefined) {
      const _showTabBar = isTabBarVisible(_scrollOffset)
      if (_showTabBar !== showTabBar) {
        setShowTabBar(_showTabBar)
      }
    }
  }, [scrollOffset, innerScrollOffset, reachBottom])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background.default }]}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.background.default} />
        <BackgroundImage offset={scrollOffset || innerScrollOffset} height={contentHeight || backgroundImageHeight} />
        <SafeAreaView style={[styles.header, { borderColor: headerStyle?.borderColor || colors.border }]}>
          {!hideHeader && (
            <Header
              title={title}
              hideGoBack={hideGoBack}
              onGoBackPress={onGoBackPress}
              style={headerStyle}
              leftIconName={leftIconName}
              rightIconName={rightIconName}
              onRightIconPress={onRightIconPress}
              step={step}
              badge={badge}
            />
          )}
        </SafeAreaView>
        {fetching && (
          <SafeAreaView style={{ zIndex: 1 }}>
            <View>
              <ActivityIndicator size={'large'} color={colors.fetching} style={styles.fetching.content} />
            </View>
          </SafeAreaView>
        )}
        {safeArea ? _renderSafeChildren() : _renderViewChildren()}
      </View>
    </KeyboardAvoidingView>
  )

  function _renderSafeChildren() {
    return (
      <SafeAreaView style={styles.content}>{enableScroll ? _renderScrollChildren() : _renderChildren()}</SafeAreaView>
    )
  }

  function _renderViewChildren() {
    return <View style={styles.content}>{enableScroll ? _renderScrollChildren() : _renderChildren()}</View>
  }

  function _renderScrollChildren() {
    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
        onScroll={(e) => setInnerScrollOffset(getScrollOffset(e))}
        scrollEventThrottle={1}
        keyboardShouldPersistTaps={'handled'}
      >
        <View onLayout={(e) => setBackgroundImageHeight(e.nativeEvent.layout.height)}>{children}</View>
      </ScrollView>
    )
  }

  function _renderChildren() {
    return <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
  }
}

export const ScreenStyles = {
  paddingTop: isSmallScreen() ? 17 : 14,
  paddingBottom: 70,
} as ViewStyle

const styles = {
  container: {
    flex: 1,
  } as ViewStyle,
  header: {
    // shadowRadius: 3,
    // shadowOffset: {
    // 	width: 0,
    // 	height: 3
    // },
    // shadowOpacity: 0.1,
    // elevation: 10,
    overflow: 'hidden',
    zIndex: 1,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  fetching: {
    content: {
      position: 'absolute',
      top: 20,
      left: '50%',
      right: '50%',
      zIndex: 10,
      alignSelf: 'center',
    } as ViewStyle,
  },
  contentContainerStyle: {
    flexGrow: 1,
    ...ScreenStyles,
  } as ViewStyle,
}
