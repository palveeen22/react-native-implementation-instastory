import React, { useEffect, useState } from 'react'
import { View, ViewStyle, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { AppState } from '../store/redux'
import { StackScreenProps } from '@react-navigation/stack'
import { NotificationItem, Screen, Alert, ScreenStyles } from '../components/'
import { notificationsReadRequestAction, notificationsRequestAction } from '../store/redux/notifications'
import { NotificationType } from '../types'
import { t } from '../localization'
import { getScrollOffset } from '../services'

type ScreenProps = DispatchProps & StateProps & StackScreenProps<any>

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

interface Props extends ScreenProps {}

const NotificationsScreen: React.FC<Props> = ({
  readNotification,
  page = 0,
  limit,
  fetching,
  total,
  getNotifications,
  notifications,
}) => {
  const [scrollOffset, setScrollOffset] = useState<number>(0)
  const [contentHeight, setContentHeight] = useState<number>(0)

  useEffect(() => {
    onRefresh()
  }, [])

  const onNotificationPress = (notification: NotificationType) => {
    Alert.alert(notification.message)
    readNotification(notification.id)
  }

  const onRefresh = () => {
    getPagination(1)
  }

  const getPagination = (_page?: number) => {
    if (!fetching && (!!_page || page * limit < total)) {
      getNotifications({ page: _page || page + 1 })
    }
  }

  return (
    <Screen title={t('notifications')} enableScroll={false} scrollOffset={scrollOffset} contentHeight={contentHeight}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <NotificationItem
            notification={item}
            onPress={onNotificationPress}
            style={[styles.marginHorizontal, !index && styles.marginTop]}
          />
        )}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={onRefresh}
        onEndReached={() => getPagination()}
        refreshing={fetching}
        onEndReachedThreshold={0.5}
        onScroll={(e) => setScrollOffset(getScrollOffset(e))}
        scrollEventThrottle={1}
        onContentSizeChange={(w, cH) => setContentHeight(cH)}
      />
    </Screen>
  )
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
