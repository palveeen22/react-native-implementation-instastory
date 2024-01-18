import React from 'react'
import { useTheme } from '@react-navigation/native'
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

const CustomModal = ({ visible, onClickFirst, title, textFirst, textSecond, onClickSecond }) => {
  const { dark } = useTheme()

  let titleStyle: any = styles.title
  let contentStyle: any = styles.modalContent

  if (dark) {
    titleStyle = [styles.title, { color: '#FFFFFF' }]
    contentStyle = [styles.modalContent, { backgroundColor: '#434343' }]
  }

  return (
    <Modal visible={visible} transparent onRequestClose={onClickSecond}>
      <TouchableWithoutFeedback onPress={onClickSecond}>
        <View style={styles.modalContainer}>
          <View style={contentStyle}>
            <Text style={titleStyle}>{title}</Text>
            <TouchableOpacity style={styles.button} onPress={onClickFirst}>
              <Text style={styles.buttonTextFirst}>{textFirst}</Text>
            </TouchableOpacity>
            <View style={styles.gap} />
            <TouchableOpacity style={styles.buttonSecond} onPress={onClickSecond}>
              <Text style={styles.buttonText}>{textSecond}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = {
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonTextFirst: {
    color: '#2F2A2A',
  },
  buttonText: {
    color: 'white',
  },
  button: {
    paddingVertical: 12,
    width: 245,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D2',
    borderRadius: 10,
    color: '#773EC1',
    alignItems: 'center',
  },
  buttonSecond: {
    paddingVertical: 12,
    width: 245,
    backgroundColor: '#773EC1',
    borderRadius: 10,
    alignItems: 'center',
  },
  gap: {
    height: 10, // Set the desired vertical gap height
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2F2A2A',
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
  },
}

export default CustomModal
