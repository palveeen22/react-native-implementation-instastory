import { useNavigation, useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { font, isSmallScreen } from '../../theme'
import Icon, { IconsType } from '../Icon'
import { t } from '../../localization'

interface HeaderProps {
  title?: string
  hideGoBack?: boolean
  onGoBackPress?: () => void
  style?: ViewStyle
  leftIconName?: IconsType
  rightIconName?: IconsType
  onRightIconPress?: () => void
  step?: [number, number]
  badge?: number | boolean
}

export default function ({
  title,
  hideGoBack,
  onGoBackPress,
  style,
  leftIconName,
  rightIconName,
  onRightIconPress,
  step,
  badge,
}: HeaderProps) {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const canGoBack = navigation.canGoBack()
  const iconContainerWidth = rightIconName ? 40 : !hideGoBack ? 20 : 0
  const hitSlop = {
    top: 50,
    bottom: 50,
    left: 100,
    right: 100,
  }
  return (
    <View style={[styles.mainContainer, style]}>
      <View style={styles.content}>
        <View style={{ width: iconContainerWidth }}>
          {!hideGoBack && (canGoBack || !!onGoBackPress) && (
            <Icon
              hitSlopArea={hitSlop}
              testID={'header_back_button'}
              style={styles.goBack}
              name={leftIconName}
              color={colors.icon.default}
              size={20}
              onPress={onGoBackPress ? onGoBackPress : navigation.goBack}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.header.title }]}>{title}</Text>
          {!!step && (
            <Text style={[styles.stepInCount, { color: colors.text.secondary }]}>{t('step', [step[0], step[1]])}</Text>
          )}
        </View>
        <View style={{ width: iconContainerWidth }}>
          {!!rightIconName && !!onRightIconPress && (
            <View style={[styles.viewForIcon, { backgroundColor: colors.background.lightgrey }]}>
              <Icon
                testID={'header_option_button'}
                style={styles.rightOptional}
                name={rightIconName}
                size={40}
                color={colors.icon.topRight}
                onPress={onRightIconPress}
              />
              {!!badge && (
                <View
                  style={[
                    rightIconName === 'filter' ? styles.filterBadge : styles.badge,
                    { backgroundColor: colors.badge.backgroud },
                  ]}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: isSmallScreen() ? 6 : 16,
    paddingTop: isSmallScreen() ? 7 : 17,
    paddingHorizontal: 16,
  },
  content: {
    minHeight: 40,
    flexDirection: 'row',
  },
  viewForIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  stepInCount: {
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
    alignSelf: 'center',
    marginTop: 8,
  },
  stepTextStyle: {
    fontFamily: font(600),
    fontSize: 12,
    lineHeight: 16,
  },
  goBack: {
    marginTop: 9,
    marginRight: 20,
  },
  rightOptional: {},
  title: {
    fontFamily: font('bold'),
    fontSize: 18,
    lineHeight: 22,
    marginTop: 7,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 4,
    width: 8,
    height: 8,
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 3,
    borderRadius: 4,
    width: 8,
    height: 8,
  },
})
