import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Image, Text, View, ViewStyle } from 'react-native'
import { Button, Markdown, Screen } from '../components'
import { DocumentType, Nullable, PickedFileType } from '../types'
import { t } from '../localization'
import { FilePickerSourceType, filePicker } from '../services'
import config from '../config'
import { RectanglePassport } from '../localization/images'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type PassportScreenProps = ScreenProps & StateProps & {}

const PassportScreen: React.FC<PassportScreenProps> = ({ navigation, route }) => {
  const { colors } = route.params

  const has_photo: boolean = false
  const [source, setSource] = useState<Nullable<FilePickerSourceType>>(null)
  const [picture, setPicture] = useState<Nullable<PickedFileType>>(null)

  useEffect(() => {
    const { screenName } = route.params
    if (screenName) {
      navigation.addListener('beforeRemove', () => {
        screenName('PhoneConfirmScreen')
      })

      screenName('PassportScreen')
    }
  }, [])

  useEffect(() => {
    if (source) {
      filePicker({
        source,
        maxFileSize: config.chat.maxFileSize,
        maxCount: 1 || config.chat.maxFiles,
        extensions: config.chat.fileTypes,
        selected: Object.values(picture || {}),
      }).then((files) => {
        console.log(files[0], "<<<<=== THIS IS FILE");

        !!files.length && setPicture(files[0])
        setSource(null)
      })
      // .finally(onCancel)
    }
  }, [source])

  const document: DocumentType = route.params.document

  // eslint-disable-next-line react/no-unstable-nested-components
  const First_page_no_passport: React.FC<any> = () => {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={[styles.main_text, { color: colors.text.title }]}>{t('take_photo_passport')}</Text>
          <Text style={[styles.detail_text, { color: colors.text.title }]}>{t('take_photo_passport_detail')}</Text>
        </View>
        <View style={styles.bottomContainer}>
          <Button
            style={styles.nextStepButton}
            text={t('take_photo')}
            onPress={() => {
              setSource('camera')
            }}
          />
        </View>
      </View>
    )
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const Second_page_no_passport: React.FC<any> = () => {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {t('check_photo_page_two')}
          </Text>
        </View>
        <View style={[styles.buttonContainer]}>
          <Button
            style={styles.button}
            text={t('re_take')}
            // onPress={onCancelEditProfile}
            type={'secondary'} />
          <Button
            // disabled={saveButtonDisabled}
            style={[styles.button, { marginLeft: 8 }]}
            text={t('next')}
            // onPress={onSaveProfile}
            type={'primary'}
          />
        </View>
      </View>
    )
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const Third_page_no_passport: React.FC<any> = () => {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={[styles.main_text, { color: colors.text.title }]}>{t('take_selfie')}</Text>
          <Text
            style={{
              color: colors.text.title,
              fontSize: 16,
              fontWeight: 400,
              marginTop: 10,
            }}
          >
            {t('take_selfie_detail')}
          </Text>
        </View>
        <View style={{ width: 300, height: 300, paddingTop: 60 }}>
          <Image
            source={picture?.uri ? { uri: picture.uri } : RectanglePassport}
            style={[styles.image, picture?.uri ? { left: 50 } : { left: 0 }]}
          />
        </View>
        <View style={[styles.buttonContainer]}>
          <Button
            style={styles.button}
            text={t('re_take')}
            onPress={() => {
              setPicture(null)
              setSource('camera')
            }}
            type={'secondary'} />
          <Button
            // disabled={saveButtonDisabled}
            style={[styles.button, { marginLeft: 8 }]}
            text={t('next')}
            onPress={() => {
              setSource('camera')
            }}
            type={'primary'}
          />
        </View>
      </View>
    )
  }
  const page: string = 'third'

  return (
    <Screen title={has_photo ? document?.title : t('add_passport')} contentContainerStyle={styles.contentContainer}>
      {has_photo ? (
        <></>
      ) : (
        <>
          {page === 'first' ? <First_page_no_passport /> : <></>}
          {page === 'second' ? <Second_page_no_passport /> : <></>}
          {page === 'third' ? <Third_page_no_passport /> : <></>}
        </>
      )}
      {/* <Markdown text={document?.content} /> */}
    </Screen >
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PassportScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
    // flex: 1,
  } as ViewStyle,
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  } as ViewStyle,
  topContainer: {
    flex: 1,
  } as ViewStyle,
  bottomContainer: {
    paddingTop: 400,
    marginBottom: 10, // Adjust the margin as needed
  } as ViewStyle,
  nextStepButton: {
    borderRadius: 10,
  } as ViewStyle,
  main_text: {
    fontSize: 22,
    fontWeight: 700,
  } as ViewStyle,
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    // marginHorizontal: 16,
  } as ViewStyle,
  detail_text: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
  } as ViewStyle,
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
  } as ViewStyle,
  image: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
  },
};