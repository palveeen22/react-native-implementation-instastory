import React from 'react'
import { View, ViewStyle, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { NotificationItem, Screen, Alert, ScreenStyles } from '../components/'
import { notificationsReadRequestAction, notificationsRequestAction } from '../store/redux/notifications'
import { NotificationType } from '../types'
import { t } from '../localization'
import { ThemeColors } from '../theme'
import { getScrollOffset } from '../services'

type ScreenProps = DispatchProps & StateProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

interface Props extends ScreenProps {}

interface State {
  scrollOffset: number
  contentHeight: number
}

class NotificationsScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      scrollOffset: 0,
      contentHeight: 0,
    }
  }

  componentDidMount() {
    this.onRefresh()
  }

  render() {
    const colors: ThemeColors = this.props.route.params.colors
    const { notifications, fetching } = this.props
    const { scrollOffset, contentHeight } = this.state

    return (
      <Screen title={t('notifications')} enableScroll={false} scrollOffset={scrollOffset} contentHeight={contentHeight}>
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <NotificationItem
              notification={item}
              onPress={this.onNotificationPress}
              style={[styles.marginHorizontal, !index && styles.marginTop]}
            />
          )}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={this.onRefresh}
          onEndReached={() => this.getPagination()}
          refreshing={fetching}
          onEndReachedThreshold={0.5}
          onScroll={(e) => this.setState({ scrollOffset: getScrollOffset(e) })}
          scrollEventThrottle={1}
          onContentSizeChange={(w, contentHeight) => this.setState({ contentHeight })}
        />
      </Screen>
    )
  }

  onNotificationPress = (notification: NotificationType) => {
    Alert.alert(notification.message)
    this.props.readNotification(notification.id)
  }

  onRefresh = () => {
    this.getPagination(1)
  }

  getPagination = (_page?: number) => {
    const { page = 0, limit, fetching, total, getNotifications } = this.props
    if (!fetching && (!!_page || page * limit < total)) {
      getNotifications({ page: _page || page + 1 })
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  notifications: state.notifications.notifications || [],
  page: state.notifications.page,
  limit: state.notifications.limit,
  total: state.notifications.total,
  fetching: state.notifications.fetching,
})

const mapDispatchToProps = {
  getNotifications: notificationsRequestAction,
  readNotification: notificationsReadRequestAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)

const styles = {
  content: {
    paddingBottom: ScreenStyles.paddingBottom,
    flexGrow: 1,
  } as ViewStyle,
  marginHorizontal: {
    marginHorizontal: 16,
  } as ViewStyle,
  marginTop: {
    marginTop: ScreenStyles.paddingTop,
  } as ViewStyle,
  separator: {
    height: 10,
  } as ViewStyle,
}
