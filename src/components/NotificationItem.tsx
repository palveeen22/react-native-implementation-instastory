import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { NotificationType } from '../types'
import moment from 'moment'
import { font } from '../theme'

interface NotificationItemProps {
  style?: ViewStyle | ViewStyle[]
  notification: NotificationType
  onPress: (notification: NotificationType) => void
}

export default function NotificationItem({ notification, onPress, style }: NotificationItemProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, { borderColor: colors.border }, style]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.titleContainer}>
        {notification.isNew && <View style={[styles.badge, { backgroundColor: colors.badge.backgroud }]} />}
        <Text style={[styles.title, { color: colors.text.title }]}>{notification?.title}</Text>
      </View>
      <Text style={[styles.message, { color: colors.text.secondary }]}>{notification?.message}</Text>
      {/* <Text
				style={[styles.date, { color: colors.text.date }]}
			>{moment(notification.date).format('DD.MM.YYYY H:mm')}</Text> */}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: font('bold'),
    fontSize: 14,
    lineHeight: 16,
    flex: 1,
  },
  message: {
    marginTop: 6,
    fontFamily: font(),
    fontSize: 12,
    lineHeight: 16,
  },
  date: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
})
