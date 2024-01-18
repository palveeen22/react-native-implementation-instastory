import { useTheme } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { View, Text, Modal as RNModal, SafeAreaView, StyleSheet } from 'react-native'
import { Button } from '../components'
import { font, isSmallScreen } from '../theme'
import { ButtonType } from './Button'
import { BackgroundImage } from './screen'

interface InfoModalProps {
  isVisible: boolean
  title: string
  text: string
  buttons?: { type?: ButtonType; text: string; onPress: () => void }[]
  image: ReactElement<any, any>
}

export default function ({ isVisible, title, text, buttons, image }: InfoModalProps) {
  const { dark, colors } = useTheme()

  return (
    <RNModal visible={isVisible} style={styles.container}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.default }]}>
        <BackgroundImage />
        {image}
        <Text style={[styles.title, { color: colors.text.default }]}>{title}</Text>
        <Text style={[styles.text, { color: colors.text.secondary }]}>{text}</Text>
        <View style={styles.buttonsContainer}>
          {buttons?.map((button, index) => (
            <Button
              key={index.toString()}
              style={[styles.button, { marginLeft: index ? 16 : 0, borderRadius: 10 }]}
              type={button.type || 'primary'}
              text={button.text}
              onPress={button.onPress}
            />
          ))}
        </View>
      </SafeAreaView>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  title: {
    fontFamily: font(700),
    fontSize: isSmallScreen() ? 24 : 32,
    lineHeight: isSmallScreen() ? 26 : 35,
    textAlign: 'center',
    marginTop: 32,
    marginHorizontal: 16,
  },
  text: {
    fontFamily: font(400),
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 47,
  },
  buttonsContainer: {
    marginTop: 32,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  button: {
    minHeight: 55,
    flex: 1,
  },
})
