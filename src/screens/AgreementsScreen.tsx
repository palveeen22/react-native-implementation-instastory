import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { ViewStyle } from 'react-native'
import { ListItem, Screen } from '../components'
import { t } from '../localization'
import { ThemeColors } from '../theme'
import { AgreementType } from '../types'
import { useSharedValue } from 'react-native-reanimated'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type AgreementsScreenProps = ScreenProps & StateProps & {}

const AgreementsScreen: React.FC<AgreementsScreenProps> = ({ agreements, route, navigation }) => {
  const colors: ThemeColors = route.params.colors

  const start = useSharedValue({ x: 0, y: 0 })

  const onAgreementPress = useCallback((agreement: AgreementType) => {
    navigation.navigate('AgreementScreen', { agreement })
  }, [])

  return (
    <Screen title={t('agreements')} contentContainerStyle={styles.contentContainer}>
      {agreements?.map((agreement, index) => (
        <ListItem key={index.toString()} text={agreement.title} onPress={() => onAgreementPress(agreement)} />
      ))}
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  agreements: state.countries.country?.documents,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementsScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
}
