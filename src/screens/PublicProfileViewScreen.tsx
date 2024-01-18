import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, Text } from 'react-native'
import { Avatar, Icon, ListItem, Screen } from '../components'
import { t } from '../localization'
import { font, ThemeColors } from '../theme'
import moment from 'moment'
import { CarType, UserProfile } from '../types'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

type RouteParams = {
  profile: UserProfile
  car: CarType
  colors: ThemeColors
}

const PublicProfileViewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { screenName } = route.params
  const { profile, car, colors } = route.params as RouteParams

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      screenName('MyTripsScreen')
    })

    screenName('PublicProfileViewScreen')
  }, [])

  const birthday = profile.birthday
  const age = moment().diff(birthday, 'year')

  const rides = car ? profile.rides_as_driver : profile.rides_as_passenger

  const profileAge = moment().diff(profile.created_at, 'months')
  const registered =
    profileAge < 1
      ? t('registered_less_months', null, { count: 1 })
      : profileAge >= 1 && profileAge < 12
      ? t('registered_more_months', null, { count: profileAge })
      : t('registered_more_years', null, {
          count: Math.floor(profileAge / 12),
        })

  return (
    <Screen title={t('user')} contentContainerStyle={styles.contentContainer}>
      <Avatar profile={profile} style={styles.photo} iconSize={44} />
      <Text style={[styles.nameAndAge, { color: colors.text.default }]}>
        {profile.first_name + ', ' + t('age', null, { count: age })}
      </Text>
      <Text style={[styles.tripCount, { color: colors.text.secondary }]}>{t('rides', null, { count: rides })}</Text>

      {car && (
        <>
          <Text style={[styles.defautTextLeft, { color: colors.text.default }]}>{t('car')}</Text>
          <ListItem style={[styles.carContainer, { borderColor: colors.border }]} car={car} />
        </>
      )}

      <Text style={[styles.defautTextLeft, { color: colors.text.default }]}>{t('additionally')}</Text>

      <View>
        <View style={styles.additionallyListEl}>
          <View style={[styles.iconBgCircle, { backgroundColor: colors.background.lightgrey }]}>
            <Icon name={'checkBoxCheck'} color={colors.icon.action} />
          </View>
          <Text style={[styles.additionallyText, { color: colors.text.default }]}>{t('phone_confirm')}</Text>
        </View>

        {profile.confirm && (
          <View style={styles.additionallyListEl}>
            <View style={[styles.iconBgCircle, { backgroundColor: colors.background.lightgrey }]}>
              <Icon name='checkBoxCheck' color={colors.icon.action} />
            </View>
            <Text style={[styles.additionallyText, { color: colors.text.default }]}>{t('show_docs_ready')}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.registry, { color: colors.text.secondary }]}>{registered}</Text>
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfileViewScreen)

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
  },
  photo: {
    marginTop: 41,
    width: 88,
    height: 88,
    borderRadius: 44,
    alignSelf: 'center',
  },
  photoContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nameAndAge: {
    alignSelf: 'center',
    marginTop: 16,
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  },
  tripCount: {
    alignSelf: 'center',
    marginTop: 8,
    fontFamily: font(400),
    fontSize: 12,
    lineHeight: 16,
  },
  registry: {
    marginTop: 36,
    fontFamily: font(400),
    fontSize: 14,
    lineHeight: 16,
  },
  defautTextLeft: {
    marginTop: 32,
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
  },
  carContainer: {
    marginTop: 16,
    minHeight: 80,
    borderWidth: 1,
  },
  label: {
    fontFamily: font(600),
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  },
  labelMargin: {
    marginTop: 32,
  },
  additionallyListEl: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 22,
  },
  additionallyText: {
    fontFamily: font(400),
    fontSize: 14,
    lineHeight: 18,
    alignSelf: 'center',
  },
  iconBgCircle: {
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
