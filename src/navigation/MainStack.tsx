const MainStack = ({ route }: any) => {
    // State and variable declarations
    const [showBottomButton, setShowBottomButton] = useState<string>('')
    const routeData: RouteData = getRouteData(route)
    const { colors } = useTheme()
    const dispatch = useDispatch()

    const tabBarVisible = useMemo(() => {
        return TAB_BAR_ROUTES.includes(showBottomButton)
    }, [showBottomButton])

    const ShowingBar = !tabBarVisible && routeData.showTabBar

    // JSX structure representing the MainNavigator stack
    return (
        <MainNavigator.Navigator
            initialRouteName='SearchTripStack'
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Screens */}
        </MainNavigator.Navigator>
    )
}
