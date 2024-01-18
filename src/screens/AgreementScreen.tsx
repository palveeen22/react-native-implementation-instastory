import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { ViewStyle } from 'react-native'
import { Markdown, Screen } from '../components'
import { AgreementType } from '../types'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type AgreementScreenProps = ScreenProps & StateProps & {}

const AgreementScreen: React.FC<AgreementScreenProps> = ({ navigation, route }) => {
  useEffect(() => {
    const { screenName } = route.params
    if (screenName) {
      navigation.addListener('beforeRemove', () => {
        screenName('PhoneConfirmScreen')
      })

      screenName('AgreementScreen')
    }
  }, [])

  const agreement: AgreementType = route.params.agreement

  return (
    <Screen title={agreement?.title} contentContainerStyle={styles.contentContainer}>
      <Markdown text={agreement?.content} />
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
}
