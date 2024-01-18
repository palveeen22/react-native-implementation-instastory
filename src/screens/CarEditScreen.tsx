import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ViewStyle } from 'react-native'
import { ImagePicker, Screen, TextInput, ColorPicker, Button, Alert } from '../components'
import { t } from '../localization'
import { ThemeColors } from '../theme'
import { CarBrandType, CarColorType, CarModelType, CarType, Nullable, PickedFileType } from '../types'
import {
  carsAddCarRequestAction,
  carsColorsRequestAction,
  carsDeleteCarRequestAction,
  carsUpdateCarRequestAction,
} from '../store/redux/cars'
import CustomModal from '../components/ModalCustomize'

type ScreenProps = DispatchProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

type Props = ScreenProps & StateProps & {}

interface State {
  car: Nullable<CarType>
  brand: Nullable<CarBrandType>
  model: Nullable<CarModelType>
  color: Nullable<CarColorType>
  photo: Nullable<PickedFileType>
  year: Nullable<string>
  number_plate: Nullable<string>
  modalVisible: boolean
}

class CarEditScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      car: null,
      brand: null,
      model: null,
      color: null,
      photo: null,
      year: null,
      number_plate: null,
      modalVisible: false,
    }
  }

  componentDidMount(): void {
    const { route, getColors } = this.props
    const { car } = route.params || {}

    if (car) {
      this.setState({ car })
    }
    getColors()
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { fetching, error, navigation } = this.props
    if (prevProps.fetching && !fetching && !error) {
      navigation.isFocused() && navigation.goBack()
    }
  }

  render() {
    const { car, photo, brand, model, year, number_plate, color, modalVisible } = this.state
    const { carColors, fetching } = this.props

    const colors: ThemeColors = this.props.route.params?.colors
    const isNewCar = !this.props.route.params?.car

    return (
      <Screen
        title={t(isNewCar ? 'add_car_process' : 'edit_car_process')}
        contentContainerStyle={styles.contentContainer}
        rightIconName={isNewCar ? undefined : 'trash'}
        onRightIconPress={() => this.setState({ modalVisible: true })}
        fetching={fetching}
      >
        <ImagePicker
          style={styles.imagePicker}
          image={photo?.uri || car?.photo?.url}
          size={68}
          onImageChange={this.onImageChange}
        />
        <TextInput
          style={styles.input}
          placeholder={t('brand')}
          value={brand?.maker || car?.car_model.make || null}
          type={'carBrandSuggest'}
          onSuggestSelect={this.onBrandSuggestSelect}
        />
        <TextInput
          style={styles.input}
          placeholder={t('model')}
          value={model?.model || (!!brand && brand.maker !== car?.car_model.make) ? model?.model : car?.car_model.model}
          type={'carModelSuggest'}
          suggestModifier={brand?.maker || car?.car_model.make}
          onSuggestSelect={this.onModelSuggestSelect}
          editable={!!brand}
        />
        <TextInput
          style={styles.input}
          placeholder={t('manufacture_year')}
          value={year?.toString() || car?.year?.toString() || null}
          onChange={this.onYearChange}
        />
        <TextInput
          style={styles.input}
          placeholder={t('state_number')}
          value={number_plate?.toString() || car?.number_plate || null}
          onChange={this.onnumber_plateChange}
        />
        <ColorPicker
          style={styles.input}
          value={color || car?.color}
          colors={carColors}
          onSelect={this.onColorSelect}
        />
        <View style={{ flex: 1 }} />
        <View style={[styles.buttonContainer]}>
          <Button
            style={styles.button}
            text={t('cancel')}
            onPress={this.onCancelPress}
            type={'secondary'}
            fetching={fetching}
          />
          <Button
            style={[styles.button, { marginLeft: 8 }]}
            text={t('save')}
            onPress={this.onSavePress}
            type={'primary'}
            fetching={fetching}
          />
        </View>
        <CustomModal
          visible={modalVisible}
          onClickFirst={this.onCarDeleteConfirm}
          onClickSecond={() => {
            this.setState({ modalVisible: false })
          }}
          title={t('delete_car_text')}
          textFirst={t('yes')}
          textSecond={t('cancel')}
        />
      </Screen>
    )
  }

  onImageChange = (photo: PickedFileType) => {
    this.setState({ photo })
  }

  onBrandSuggestSelect = (brand) => {
    this.setState({ brand: brand as CarBrandType, model: null })
  }

  onModelSuggestSelect = (model) => {
    this.setState({ model: model as CarModelType })
  }

  onYearChange = (year: string) => {
    this.setState({ year })
  }

  onnumber_plateChange = (number_plate: string) => {
    this.setState({ number_plate })
  }

  onColorSelect = (color: CarColorType) => {
    this.setState({ color })
  }

  onCancelPress = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  onSavePress = () => {
    const { addCar, profile_id, updateCar } = this.props
    const { car, model, color, year, photo, number_plate, brand } = this.state

    if (car) {
      updateCar({
        id: car.id,
        car_model_id: model?.id || (!!brand && brand.maker !== car?.car_model.make) ? model?.id : car?.car_model.id,
        photo_id: photo ? undefined : car.photo?.id,
        color_id: color?.id || car.color.id,
        year: year || car.year,
        number_plate: number_plate || car?.number_plate,
        newPhoto: photo,
      })
    } else {
      addCar({
        client_id: profile_id,
        car_model_id: model?.id,
        photo_id: undefined,
        color_id: color?.id,
        photo,
        year,
        number_plate,
      })
    }
  }

  onCarDeleteConfirm = () => {
    const { car } = this.state
    this.props.deleteCar({ id: car.id })
  }
}

const mapStateToProps = (state: AppState, ownProps: ScreenProps) => ({
  carColors: state.cars.colors,
  profile_id: state.user.profile?.id,
  fetching: state.cars.fetching,
  error: state.cars.error,
})

const mapDispatchToProps = {
  getColors: carsColorsRequestAction,
  addCar: carsAddCarRequestAction,
  updateCar: carsUpdateCarRequestAction,
  deleteCar: carsDeleteCarRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarEditScreen)

const styles = {
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  } as ViewStyle,
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 16,
  } as ViewStyle,
  input: {
    marginTop: 16,
  } as ViewStyle,
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
  } as ViewStyle,
  button: {
    flex: 1,
    height: 50,
  } as ViewStyle,
}
