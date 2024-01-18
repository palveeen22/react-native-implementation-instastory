const palette = {
  main: '#481C81',
  lightBlue: '#007AFF',
  white: '#FFFFFF',
  lightgray: '#F2F2F2',
  text: '#2F2A2A',
  secondary: '#AEAEAE',
  lightgraysecondary: '#7D7D7D',
  transparent: 'transparent',
  dayOfWeek: '#434343',
  darkgray: '#626262',
  gray: '#D6D0D0',
  error: '#ED4949',
  line: '#D7D7D7',
  border: '#D0D0D2',
  inactiveButtonBorder: 'rgba(174, 174, 174, 0.7)',
  activeButtonBorder: 'rgba(147, 116, 203, 0.2)',
}

export default {
  separator: {
    default: palette.line,
  },
  border: palette.lightgray,
  fetching: palette.main,
  shadow: '#000000',
  header: {
    title: palette.text,
  },
  codeInput: {
    border: palette.main,
    background: palette.lightgray,
    text: palette.main,
  },
  background: {
    default: palette.white,
    lightgrey: palette.lightgray,
    line: palette.line,
    main: palette.main,
  },
  error: {
    default: palette.error,
  },
  tabBar: {
    activeTintColor: palette.main,
    inactiveTintColor: palette.lightgraysecondary,
    inactiveBackgroundColor: palette.lightgray,
    activeBackgroundColor: palette.lightgray,
  },
  badge: {
    text: '#FFFFFF',
    backgroud: palette.main,
  },
  alert: {
    wrapper: 'rgba(0 ,0 ,0 ,0.6)',
    background: palette.white,
    border: palette.secondary,
    buttonText: palette.lightBlue,
  },
  switch: {
    text: palette.text,
    count: palette.secondary,
    checkBox: {
      active: palette.main,
      inactive: palette.secondary,
      checked: palette.white,
    },
    radiobutton: {
      active: palette.main,
      inactive: palette.secondary,
    },
    switch: {
      trackActive: palette.main,
      trackInactive: 'rgba(174, 174, 174, 0.7)',
      toggleActive: palette.lightgray,
      toggleInactive: palette.white,
    },
  },
  text: {
    default: palette.text,
    placeholder: palette.secondary,
    title: palette.text,
    date: '#DCDCDC',
    secondary: palette.secondary,
    action: palette.main,
  },
  myTripTypeSelector: {
    activeText: palette.text,
    activeBorder: palette.main,
    inactiveText: palette.secondary,
    inactiveBorder: 'rgba(174, 174, 174, 0.2)',
  },
  button: {
    primary: {
      background: palette.main,
      text: palette.white,
      border: palette.main,
      icon: palette.white,
    },
    secondary: {
      background: palette.transparent,
      text: palette.text,
      border: palette.secondary,
      icon: palette.text,
    },
    disabled: {
      background: '#DCDCDC',
      text: '#FFFFFF',
      icon: '#FFFFFF',
      border: '#DCDCDC',
    },
    bordered: {
      background: palette.transparent,
      text: palette.main,
      icon: palette.main,
      border: palette.transparent,
    },
  },
  textInput: {
    background: palette.lightgray,
    border: palette.main,
    borderActive: palette.secondary,
    borderInActive: palette.lightgray,
    error: palette.error,
  },
  icon: {
    default: palette.text,
    action: palette.main,
    disabled: '#DCDCDC',
    secondary: palette.secondary,
    topRight: 'rgba(174, 174, 174, 0.7)',
    topRight2: palette.main,
    action2: palette.white,
  },
  selector: {
    activeText: palette.main,
    inactiveText: palette.text,
    activeBorder: 'transparent',
    inactiveBorder: palette.inactiveButtonBorder,
    activeBackground: 'rgba(147, 116, 203, 0.2)',
    inactiveBackground: palette.transparent,
    activeIcon: palette.main,
    inactiveIcon: palette.secondary,
  },
  tripInfo: {
    background: palette.lightgray,
    header: {
      label: palette.text,
      cancelledLabel: palette.secondary,
      status: palette.text,
    },
    body: {
      city: palette.text,
      cityVisited: palette.text,
      cityCancelled: palette.secondary,
      time: palette.secondary,
      timeCancelled: palette.secondary,
      address: palette.dayOfWeek,
      addressCancelled: palette.dayOfWeek,
    },
    footer: {
      active: palette.text,
      cancelled: palette.secondary,
      currency: palette.lightgray,
      currencyCanceled: palette.lightgray,
      currencyBackground: palette.main,
      currencyCancelledBackground: 'rgba(174, 174, 174, 0.5)',
      avatar: palette.secondary,
      avatarCancelled: palette.secondary,
      avatarBackground: 'rgba(255, 255, 255, 0.7)',
      avatarCancelledBackground: 'rgba(174, 174, 174, 0.1)',
      textPrimary: palette.text,
      textSecondary: palette.secondary,
      main: palette.main,
    },
  },
  waypointImage: {
    background: palette.lightgray,
    active: palette.main,
    inactive: palette.secondary,
    cancelled: palette.secondary,
    visitedLine: palette.main,
  },
  imagePicker: {
    background: palette.activeButtonBorder,
  },
  avatar: {
    background: palette.activeButtonBorder,
    backgroundOpacity: 'rgba(255, 255, 255, 0.7)',
  },
  listItem: {
    avatar: palette.secondary,
    avatarBackground: 'background: rgba(242, 242, 242, 0.7)',
    userAvatar: palette.main,
    userAvatarBackground: 'rgba(147, 116, 203, 0.2)',
  },
  tripComfortItem: {
    activeIcon: palette.secondary,
    activeText: palette.text,
    inactiveIcon: '#DEDEDE',
    inactiveText: palette.secondary,
  },
  filterItem: {
    border: palette.lightgray,
    background: palette.transparent,
  },
}
