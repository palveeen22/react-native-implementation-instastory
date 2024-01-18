import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect, useRef } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Icon, IconsType } from '.'
import config from '../config'
import { t } from '../localization'
import { filePicker, FilePickerSourceType } from '../services'
import { font } from '../theme'
import { Nullable, PickedFileType, UploadFileType } from '../types'
import Modal from './Modal'
import { RNCamera } from 'react-native-camera'

interface MenuType {
  icon: IconsType
  text: string
  source: FilePickerSourceType
}

interface Props {
  visible: boolean
  files?: UploadFileType[] | PickedFileType[] | null
  onAddFiles: (files: PickedFileType[]) => void
  onCancel: () => void
  filesCount?: number
}

export default function ({ visible, files, onAddFiles, onCancel, filesCount }: Props) {
  const { colors } = useTheme()
  const cameraRef = useRef(null)

  const [source, setSource] = useState<Nullable<FilePickerSourceType>>(null)

  const handleCapture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true }
      const data = await cameraRef.current.takePictureAsync(options)
      console.log(data.uri)
    }
  }

  useEffect(() => {
    if (source) {
      filePicker({
        source,
        maxFileSize: config.chat.maxFileSize,
        maxCount: filesCount || config.chat.maxFiles,
        extensions: config.chat.fileTypes,
        selected: Object.values(files || {}),
      })
        .then((files) => {
          !!files.length && onAddFiles(files)
          setSource(null)
        })
        .finally(onCancel)
    }
  }, [source])

  const getMenu = () =>
    [
      { icon: 'photo', text: t('attachment_photo'), source: 'camera' },
      { icon: 'gallery', text: t('attachment_gallery'), source: 'gallery' },
    ] as MenuType[]

  return (
    <Modal isVisible={visible} onClose={onCancel} header={t('download_file')}>
      <RNCamera
        captureAudio={false}
        style={{ flex: 1 }}
        ref={(ref) => (cameraRef.current = ref)}
        type={RNCamera.Constants.Type.back}
      />
      {getMenu().map((item, index) => (
        <View key={index.toString()}>
          {index > 0 && <View style={[styles.separator, { backgroundColor: colors.background.line }]} />}
          <TouchableOpacity style={styles.menuContainer} onPress={() => setSource(item.source)}>
            <Icon name={item.icon} color={colors.icon.default} />
            <Text style={[styles.menuText, { color: colors.text.default }]}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </Modal>
  )
}

const styles = StyleSheet.create({
  menuContainer: {
    marginHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontFamily: font('bold'),
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 12,
  },
  separator: {
    height: 1,
    flex: 1,
    marginVertical: 16,
  },
})
