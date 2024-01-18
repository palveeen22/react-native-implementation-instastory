import { useTheme } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import { font, metrics } from '../theme'
import Icon, { IconsType } from './Icon'

interface ModalProps {
  style?: ViewStyle | ViewStyle[]
  isVisible: boolean
  children: ReactElement<any, any> | ReactElement<any, any>[]
  footer?: ReactElement<any, any> | ReactElement<any, any>[]
  onClose: () => void
  closeButton?: boolean
  closeIcon?: IconsType
  iconColor?: string
  header?: string
  onModalHide?: () => void
  fullScreen?: boolean
}

export default function ({
  style,
  isVisible,
  onClose,
  children,
  closeButton = true,
  header,
  footer,
  onModalHide,
  fullScreen = false,
}: ModalProps) {
  const { colors } = useTheme()

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.container}
      onModalHide={onModalHide}
    >
      <SafeAreaView>
        <TouchableOpacity style={{ height: metrics.screenHeight * 0.1 }} onPress={onClose} />
      </SafeAreaView>
      <SafeAreaView
        style={[
          styles.modalContent,
          {
            backgroundColor: colors.background.default,
            flex: fullScreen ? 1 : 0,
          },
        ]}
      >
        {!!header && (
          <View style={[styles.headerContainer, { borderColor: colors.border }]}>
            <View style={styles.headerContent}>
              <Text style={[styles.header, { color: colors.text.default }]}>{header}</Text>
            </View>
            <Icon
              name={'close'}
              size={30}
              color={colors.icon.secondary}
              backgroundColor={colors.background.default}
              onPress={onClose}
              isVisible={closeButton}
            />
          </View>
        )}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainerStyle, style]}
          keyboardShouldPersistTaps={'handled'}
        >
          {children}
        </ScrollView>
        {footer}
      </SafeAreaView>
    </ReactNativeModal>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    overflow: 'hidden',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 24,
    borderBottomWidth: 1,
  },
  contentContainerStyle: {
    paddingVertical: 16,
  },
  headerContent: {
    marginLeft: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontFamily: font(700),
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
  },
})
