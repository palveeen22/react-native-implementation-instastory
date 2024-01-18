import { combineTheme, ThemeColors } from '.'
import { t } from '../localization'

export default {
  dark: false,
  name: t('themes_light'),
  colors: combineTheme({} as ThemeColors),
}
