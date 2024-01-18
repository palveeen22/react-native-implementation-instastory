import { I18n } from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

import ru from './ru'

const i18n = new I18n()

const locales = RNLocalize.getLocales()

if (Array.isArray(locales)) {
  i18n.locale = locales[0].languageTag
}

const translations: { [key: string]: Localization } = {
  ru,
}

i18n.defaultLocale = 'ru'
i18n.translations = translations
i18n.pluralization.ru = function (count) {
  var key =
    count % 10 == 1 && count % 100 != 11
      ? 'one'
      : [2, 3, 4].indexOf(count % 10) >= 0 && [12, 13, 14].indexOf(count % 100) < 0
      ? 'few'
      : count % 10 == 0 || [5, 6, 7, 8, 9].indexOf(count % 10) >= 0 || [11, 12, 13, 14].indexOf(count % 100) >= 0
      ? 'many'
      : 'other'
  return [key]
}

export default i18n

export function t(message: Translation, replace: Array<string | number> = [], options?: { [key: string]: any }) {
  let _message = i18n.t(message, options)
  replace?.forEach((string: string | number) => {
    if (message === 'currency') {
      string = string?.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
    }
    _message = _message?.replace('%s', string?.toString())
  })
  return _message
}
export type Localizations = keyof typeof translations
export type Localization = typeof ru
export type Translation = keyof Localization
