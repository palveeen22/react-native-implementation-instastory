import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modal } from '..'
import { font } from '../../theme'
import { Nullable, CarBrandType, CarModelsType, PlaceSuggestType, CitySuggestType, PhoneType } from '../../types'
import TextInput, { TextInputProps } from './TextInput'
import { api } from '../../store/saga'
import uuid from 'react-native-uuid'
import SuggestItem from './SuggestItem'

interface Props extends TextInputProps {
  onSuggestSelect?: (item: Nullable<SuggestType>) => void
  onPress?: () => void
  suggestModifier?: string
  backgroundColor?: string
  sessionToken?: string
}

type SuggestTypes = PlaceSuggestType | CarBrandType | CarModelsType | CitySuggestType | PhoneType

export type SuggestType = SuggestTypes & {
  _name_: string
}

export default function (params: Props) {
  const { colors } = useTheme()
  const {
    dataList,
    onChange,
    value,
    onSuggestSelect,
    style,
    onPress,
    editable = true,
    suggestModifier,
    backgroundColor = colors.textInput.background,
    borderColor,
    searchInPlace,
    sessionToken,
    type,
  } = params
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [innerValue, setInnerValue] = useState<Nullable<string>>(null)
  const [suggest, setSuggest] = useState<Nullable<SuggestType[]>>(null)
  const hasSuggest = ['countryList', 'citySuggest', 'carBrandSuggest', 'carModelSuggest', 'carColorSuggest'].includes(
    params.type
  )
  const [defaultSessionToken, setDefaultSessionToken] = useState<Nullable<string>>(null)

  useEffect(() => {
    setDefaultSessionToken(uuid.v4().toString())
  }, [])

  useEffect(() => {
    if (hasSuggest) {
      setInnerValue(value)
    }
  }, [value, showSuggestModal])

  useEffect(() => {
    if (showSuggestModal) {
      switch (type) {
        case 'countryList': {
          setSuggest(dataList.map((city) => ({ ...city, _name_: `${city?.phone_code} ${city.name}` })))
          break
        }
        case 'citySuggest': {
          const input = searchInPlace ? `${searchInPlace}, ${innerValue}` : innerValue
          api
            .getPlace({
              input,
              detail: searchInPlace ? 1 : 0,
              sessionToken: sessionToken || defaultSessionToken,
            })
            .then((response) => {
              if (response.ok) {
                const { cities } = response.data.result
                setSuggest(cities.map((city) => ({ ...city, _name_: `${city.description}` })))
              }
            })
          break
        }
        case 'carBrandSuggest': {
          api.getCarBrandSuggest({ search: innerValue }).then((response) => {
            if (response.ok) {
              const { makers } = response.data.result
              const _makers = makers.map((brand) => ({
                ...brand,
                _name_: brand.maker,
              }))
              setSuggest(_makers)
            }
          })
          break
        }
        case 'carModelSuggest': {
          api.getCarModelsSuggest({ maker: suggestModifier, search: innerValue }).then((response) => {
            if (response.ok) {
              const { models } = response.data.result
              const _models = models.map((model) => ({
                ...model,
                _name_: model.model,
              }))
              setSuggest(_models)
            }
          })
          break
        }
        default:
          break
      }
    }
  }, [innerValue, showSuggestModal])

  return (
    <View style={style}>
      {hasSuggest && <TouchableOpacity style={styles.modalButton} onPress={() => setShowSuggestModal(true)} />}
      <TextInput
        {...params}
        value={value}
        autoFocus={type === 'phone'}
        style={undefined}
        backgroundColor={backgroundColor}
        borderColor={borderColor || (showSuggestModal ? colors.textInput.border : undefined)}
      />
      <Modal
        isVisible={showSuggestModal}
        onClose={() => {
          if (!innerValue) {
            !!onSuggestSelect && onSuggestSelect(null)
          }
          setShowSuggestModal(false)
        }}
        fullScreen
        closeButton={false}
      >
        <View style={styles.modalContent}>
          {type !== 'countryList' ? (
            <TextInput
              value={innerValue}
              onChange={(text) => {
                setInnerValue(text)
                !!onChange && onChange(text)
              }}
              textStyle={styles.modalInputStyle}
              style={styles.modalInput}
              autoFocus
              borderColor={colors.textInput.background}
            />
          ) : (
            <></>
          )}
          {suggest?.map((item, index) => (
            <SuggestItem
              key={index.toString()}
              style={[
                styles.variantContainer,
                type === 'countryList'
                  ? {
                    flex: 1,
                    flexDirection: 'row',
                    gap: 10,
                  }
                  : {},
              ]}
              item={item}
              isCountry={type === 'countryList'}
              onPress={() => {
                setShowSuggestModal(false)
                delete item._name_
                !!onSuggestSelect &&
                  onSuggestSelect({
                    ...item,
                    sessionToken: sessionToken || defaultSessionToken,
                  })
              }}
            />
          ))}
        </View>
      </Modal>
      {!editable && <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.backdrop} />}
    </View>
  )
}

const styles = StyleSheet.create({
  modalButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  modalContent: {
    paddingHorizontal: 16,
  },
  modalInputStyle: {
    fontFamily: font(),
    fontSize: 14,
  },
  modalInput: {
    marginBottom: 10,
  },
  variantContainer: {
    marginBottom: 5,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  suggestContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
  },
})
