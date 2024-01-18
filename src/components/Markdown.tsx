import React from 'react'
import ReactNativeMarkdown from 'react-native-markdown-display'
import { useTheme } from '@react-navigation/native'
import { StyleSheet, TextStyle, View } from 'react-native'
import { font } from '../theme'
import { mergeStyles } from '../services'

interface Props {
  text: any
  style?: TextStyle | TextStyle[]
  paragraphStyle?: TextStyle | TextStyle[]
  linkStyle?: TextStyle | TextStyle[]
  onLinkPress?: (url: string) => void
}

export default function (props: Props) {
  const { colors } = useTheme()
  const { text, style, paragraphStyle, linkStyle, onLinkPress } = props

  return (
    <View style={style}>
      <ReactNativeMarkdown
        style={{
          paragraph: {
            ...styles.paragraph,
            color: colors.text.default,
            ...mergeStyles(paragraphStyle),
          },
          link: {
            ...styles.link,
            color: colors.text.action,
            ...mergeStyles(linkStyle),
          },
          list_item: {
            ...styles.listItem,
            color: colors.text.default,
          },
        }}
        onLinkPress={(url) => {
          !!onLinkPress && onLinkPress(url)
          return !onLinkPress
        }}
      >
        {text}
      </ReactNativeMarkdown>
    </View>
  )
}

const styles = StyleSheet.create({
  paragraph: {
    marginTop: 8,
    marginBottom: 0,
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'none',
  },
  listItem: {
    fontFamily: font(),
    fontSize: 14,
    lineHeight: 20,
  },
})
