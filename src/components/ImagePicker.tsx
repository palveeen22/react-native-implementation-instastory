import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, View, ViewStyle } from 'react-native'
import { FilePickerModal, Icon } from '.'
import { PickedFileType } from '../types'

interface ImagePickerProps {
  style?: ViewStyle | ViewStyle[]
  size: number
  image: string
  onImageChange: (image: PickedFileType) => void
}

export default function ({ style, size, image, onImageChange }: ImagePickerProps) {
  const { dark, colors } = useTheme()

  const [showFilePickerModal, setShowFilePickerModal] = useState<boolean>(false)

  return (
    <View style={[styles.container, style, { width: size, height: size }]}>
      <View style={[styles.imageContainer, { backgroundColor: colors.imagePicker.background }]}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Icon name={'add_photo'} size={32} onPress={onAddPhotoPress} />
        )}
      </View>
      <Icon
        isVisible={!!image}
        onPress={onAddPhotoPress}
        style={styles.editProfile}
        name={'editProfilePhoto'}
        size={32}
        color={colors.icon.action}
      />
      <FilePickerModal
        visible={showFilePickerModal}
        onAddFiles={onAddFiles}
        onCancel={onCancelModalPress}
        filesCount={1}
      />
    </View>
  )

  function onAddPhotoPress() {
    setShowFilePickerModal(true)
  }

  function onCancelModalPress() {
    setShowFilePickerModal(false)
  }

  function onAddFiles(pickedFiles: PickedFileType[]) {
    onImageChange(pickedFiles[0])
  }
}

const styles = StyleSheet.create({
  container: {
    width: 88,
    height: 88,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 88 / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  editProfile: {
    position: 'absolute',
    bottom: 0,
    right: -16,
  },
})
