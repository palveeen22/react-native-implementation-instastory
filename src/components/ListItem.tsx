import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Avatar, Color, Icon } from '.'
import { font } from '../theme'
import { UserProfile, CarType } from '../types'

export interface ListItemProps {
  style?: ViewStyle | ViewStyle[]
  car?: CarType
  profile?: UserProfile
  text?: string
  secondText?: string
  icon_image?: string
  icon_size?: number
  thirdText?: string
  count?: number
  userProfile?: boolean
  onPress?: () => void
  onSendMessagePress?: (phone: string) => void
  onCallPress?: (phone: string) => void
  onCancelPassengerPress?: (passenget_id: number) => void
}

export default function ({
  style,
  car,
  profile,
  text,
  secondText,
  icon_image,
  icon_size,
  thirdText,
  count,
  userProfile = false,
  onPress,
  onSendMessagePress,
  onCallPress,
  onCancelPassengerPress,
}: ListItemProps) {
  const { dark, colors } = useTheme()
  console.log(icon_image, "<<====icon_image");

  const showRightIcon = !!onPress && !(!!onSendMessagePress || !!onCallPress || !!onCancelPassengerPress)

  return (
    <Pressable
      style={[
        {
          borderColor: colors.border,
          borderWidth: !!car || !!profile ? 1 : undefined,
          padding: !!car || !!profile ? 15 : 16,
        },
        styles.container,
        style,
      ]}
      onPress={onPress}
    >
      <Avatar
        car={car}
        profile={profile}
        tintColor={userProfile || !!car ? colors.listItem.userAvatar : colors.listItem.avatar}
        backgroundColor={userProfile ? colors.listItem.userAvatarBackground : colors.listItem.avatarBackground}
      />
      <View
        style={
          icon_image
            ? [
              {
                flexDirection: 'row',
                flex: 1,
                gap: 5,
              }] : [styles.textContainer]}>
        {!car && !profile && icon_image && <Icon name={icon_image} size={icon_size} />}
        <View>
          {!car && !profile && <Text style={[styles.defaultText, { color: colors.text.default }]}>{text}</Text>}
          {!car && !profile && secondText && (
            <Text
              style={[
                {
                  color: colors.text.default,
                  fontSize: 12,
                  fontWeight: 400,
                },
              ]}
            >
              {secondText}
            </Text>
          )}
          {!car && !profile && thirdText && (
            <Text
              style={[
                {
                  color: colors.text.default,
                  fontSize: 12,
                  fontWeight: 400,
                },
              ]}
            >
              {thirdText}
            </Text>
          )}
        </View>
        {!!car && (
          <View>
            <Text style={[styles.carModel, { color: colors.text.default }]}>
              {car.car_model.fullname}
              <Text style={[styles.carYear, { color: colors.text.secondary }]}>, {car.year}</Text>
            </Text>
            <View style={styles.carColorContainer}>
              <Color color={car.color.color_code} />
              <Text style={[styles.carColorName, { color: colors.text.secondary }]}>{car.color.label}</Text>
            </View>
          </View>
        )}
        {!!profile && (
          <View style={styles.contentContainer}>
            <View style={{ flex: 1 }}>
              <Text style={[userProfile ? styles.userProfileName : styles.profileName, { color: colors.text.default }]}>
                {!!count && !!(count - 1 > 0) ? profile.first_name + ` (+${count - 1})` : profile.first_name}
              </Text>
              {!!text && (
                <Text
                  style={[userProfile ? styles.userProfileText : styles.profileText, { color: colors.text.secondary }]}
                >
                  {text}
                </Text>
              )}
            </View>
            {!!onCancelPassengerPress && (
              <Pressable style={styles.actionButton} onPress={() => onCancelPassengerPress(profile.id)}>
                <Icon name={'close'} size={20} color={colors.icon.secondary} />
              </Pressable>
            )}
            {!!onCallPress && (
              <Pressable
                style={[styles.actionButton, { backgroundColor: colors.background.main }]}
                onPress={() => onCallPress(profile.phone)}
              >
                <Icon name={'call'} size={20} color={colors.icon.action2} />
              </Pressable>
            )}
            {!!onSendMessagePress && (
              <Pressable
                style={[styles.actionButton, { backgroundColor: colors.background.main }]}
                onPress={() => onSendMessagePress(profile.phone)}
              >
                <Icon name={'message2'} size={20} color={colors.icon.action2} />
              </Pressable>
            )}
          </View>
        )}
      </View>
      <Icon isVisible={showRightIcon} name={'chevronRight'} color={colors.icon.secondary} />
    </Pressable >
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    minHeight: 64,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: font(),
  },
  carModel: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: font('bold'),
  },
  carYear: {
    fontFamily: font(),
  },
  carColorContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  carColorName: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: font(),
    letterSpacing: 0.006,
    marginLeft: 6,
  },
  userProfileName: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: font('bold'),
  },
  userProfileText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: font(),
  },
  profileName: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: font(),
  },
  profileText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: font(),
  },
  actionButton: {
    marginLeft: 10,
    borderRadius: 17,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
