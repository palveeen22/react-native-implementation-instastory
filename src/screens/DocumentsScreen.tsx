import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, ViewStyle } from 'react-native'
import { ListItem, Screen } from '../components'
import { t } from '../localization'
import { ThemeColors } from '../theme'
import { AgreementType } from '../types'
import { useSharedValue } from 'react-native-reanimated'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type DocumentsScreenProps = ScreenProps & StateProps & {}

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ route, navigation }) => {
  const colors: ThemeColors = route.params.colors

  const start = useSharedValue({ x: 0, y: 0 })

  const onDocumentPress = useCallback((document: AgreementType) => {
    navigation.navigate('PassportScreen', { document })
  }, [])

  return (
    <Screen title={t('documents')} contentContainerStyle={styles.contentContainer}>
      {[
        { title: 'Паспорт', desc: 'Необходимо переснять', icon: 'passport_icon' },
        { title: 'ИНН', desc: 'Подтвержден', icon: 'inn_icon' },
        { title: 'СНИЛС', desc: 'На проверке', icon: 'snils_icon' },
      ]?.map((document, index) => (
        <ListItem
          key={index.toString()}
          text={document.title}
          secondText={document.desc}
          icon_image={document.icon}
          icon_size={30}
          onPress={() => onDocumentPress(document)} />
      ))}
    </Screen>
  )
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  // agreements: state.countries.country?.documents,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
  } as ViewStyle,
}
