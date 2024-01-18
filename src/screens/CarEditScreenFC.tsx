import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ViewStyle } from 'react-native'
import { ImagePicker, Screen, TextInput, ColorPicker, Button, Alert } from '../components'
import { t } from '../localization'
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

type CarEditScreenProps = ScreenProps & StateProps & {}

const CarEditScreen: React.FC<CarEditScreenProps> = ({
  route,
  getColors,
  fetching,
  error,
  navigation,
  carColors,
  profile_id,
  updateCar,
  addCar,
  deleteCar,
}) => {
  const isNewCar = route.params.car ?? null

  const [car, setCar] = useState<Nullable<CarType>>(null)
  const [brand, setBrand] = useState<Nullable<CarBrandType>>(null)
  const [model, setModel] = useState<Nullable<CarModelType>>(null)
  const [color, setColor] = useState<Nullable<CarColorType>>(null)
  const [photo, setPhoto] = useState<Nullable<PickedFileType>>(null)
  const [year, setYear] = useState<Nullable<string>>(null)
  const [numberPlate, setNumberPlate] = useState<Nullable<string>>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => {
    const { car } = route.params ?? {}
    if (car) {
      setCar(car)
    }
    getColors()
  }, [])

  useEffect(() => {
    if (!fetching && !error) {
      navigation.isFocused() && navigation.goBack()
    }
  }, [fetching, error, navigation])

  const onImageChange = (value: PickedFileType) => {
    setPhoto(value)
  }

  const onBrandSuggestSelect = (value) => {
    setBrand(value)
  }

  const onModelSuggestSelect = (value) => {
    setModel(value)
  }

  const onYearChange = (value: string) => {
    setYear(value)
  }

  const onnumber_plateChange = (value: string) => {
    setNumberPlate(value)
  }

  const onColorSelect = (value: CarColorType) => {
    setColor(value)
  }

  const onCancelPress = () => {
    navigation.goBack()
  }

  const onSavePress = () => {
    if (car) {
      updateCar({
        id: car.id,
        car_model_id: model?.id || (!!brand && brand.maker !== car?.car_model.make) ? model?.id : car?.car_model.id,
        photo_id: photo ? undefined : car.photo?.id,
        color_id: color?.id || car.color.id,
        year: year || car.year,
        number_plate: numberPlate || car?.number_plate,
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
        number_plate: numberPlate,
      })
    }
  }

  const onCarDeleteConfirm = () => {
    deleteCar({ id: car.id })
  }

  return (
    <Screen
      title={t(isNewCar ? 'add_car_process' : 'edit_car_process')}
      contentContainerStyle={styles.contentContainer}
      rightIconName={isNewCar ? undefined : 'trash'}
      onRightIconPress={() => setModalVisible(true)}
      fetching={fetching}
    >
      <ImagePicker
        style={styles.imagePicker}
        image={photo?.uri || car?.photo?.url}
        size={68}
        onImageChange={onImageChange}
      />
      <TextInput
        style={styles.input}
        placeholder={t('brand')}
        value={brand?.maker || car?.car_model.make || null}
        type={'carBrandSuggest'}
        onSuggestSelect={onBrandSuggestSelect}
      />
      <TextInput
        style={styles.input}
        placeholder={t('model')}
        value={model?.model || (!!brand && brand.maker !== car?.car_model.make) ? model?.model : car?.car_model.model}
        type={'carModelSuggest'}
        suggestModifier={brand?.maker || car?.car_model.make}
        onSuggestSelect={onModelSuggestSelect}
        editable={!!brand}
      />
      <TextInput
        style={styles.input}
        placeholder={t('manufacture_year')}
        value={year?.toString() || car?.year?.toString() || null}
        onChange={onYearChange}
      />
      <TextInput
        style={styles.input}
        placeholder={t('state_number')}
        value={numberPlate?.toString() || car?.number_plate || null}
        onChange={onnumber_plateChange}
      />
      <ColorPicker style={styles.input} value={color || car?.color} colors={carColors} onSelect={onColorSelect} />
      <View style={{ flex: 1 }} />
      <View style={[styles.buttonContainer]}>
        <Button
          style={styles.button}
          text={t('cancel')}
          onPress={onCancelPress}
          type={'secondary'}
          fetching={fetching}
        />
        <Button
          style={[styles.button, { marginLeft: 8 }]}
          text={t('save')}
          onPress={onSavePress}
          type={'primary'}
          fetching={fetching}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onClickFirst={onCarDeleteConfirm}
        onClickSecond={() => {
          setModalVisible(false)
        }}
        title={t('delete_car_text')}
        textFirst={t('yes')}
        textSecond={t('cancel')}
      />
    </Screen>
  )
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
