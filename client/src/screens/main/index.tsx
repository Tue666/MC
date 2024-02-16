import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useGlobalStyles from '../../styles/global.style';
import useStackStyles from '../../styles/stack.style';
import { MainLayout } from '../../layouts';
import { MAIN_LAYOUT } from '../../configs/constant';
import Conquer from './Conquer.screen';
import Ranking from './Raking.screen';
import Account from './Account.screen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
	const theme = useTheme();
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();

	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={({ state, descriptors, navigation }) => {
				return (
					<View style={{ ...styles.bar, ...stackStyles.row, ...globalStyles.paper, ...globalStyles.shadow }}>
						{state.routes.map((route, index) => {
							const { options } = descriptors[route.key];
							const icon = options.tabBarIcon;
							const isFocused = state.index === index;

							const onPress = () => {
								const event = navigation.emit({
									type: 'tabPress',
									target: route.key,
									canPreventDefault: true,
								});

								if (!isFocused && !event.defaultPrevented) {
									navigation.navigate(route.name, route.params);
								}
							};
							const onLongPress = () => {
								navigation.emit({
									type: 'tabLongPress',
									target: route.key,
								});
							};

							if (icon)
								return (
									<TouchableOpacity
										key={index}
										onPress={onPress}
										onLongPress={onLongPress}
										style={{ ...styles.button }}
									>
										{icon({
											focused: isFocused,
											color: isFocused ? theme.colors.primary : theme.colors.outline,
											size: MAIN_LAYOUT.BOTTOM_BAR.BUTTON.ICON_SIZE,
										})}
									</TouchableOpacity>
								);
						})}
					</View>
				);
			}}
		>
			<Tab.Screen
				name="Conquer"
				options={{ tabBarIcon: ({ color, size }) => <Icon name="token" color={color} size={size} /> }}
			>
				{() => (
					<MainLayout>
						<Conquer />
					</MainLayout>
				)}
			</Tab.Screen>
			<Tab.Screen
				name="Ranking"
				options={{ tabBarIcon: ({ color, size }) => <Icon name="leaderboard" color={color} size={size} /> }}
			>
				{() => (
					<MainLayout>
						<Ranking />
					</MainLayout>
				)}
			</Tab.Screen>
			<Tab.Screen
				name="Account"
				options={{ tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} /> }}
			>
				{() => (
					<MainLayout>
						<Account />
					</MainLayout>
				)}
			</Tab.Screen>
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	bar: {
		position: 'absolute',
		bottom: MAIN_LAYOUT.BOTTOM_BAR.BOTTOM,
		padding: MAIN_LAYOUT.BOTTOM_BAR.PADDING,
		marginVertical: MAIN_LAYOUT.BOTTOM_BAR.MARGIN_VERTICAL,
		marginHorizontal: MAIN_LAYOUT.BOTTOM_BAR.MARGIN_HORIZONTAL,
		borderRadius: MAIN_LAYOUT.BOTTOM_BAR.BORDER_RADIUS,
	},
	button: {
		flex: 1,
		alignItems: 'center',
		padding: MAIN_LAYOUT.BOTTOM_BAR.BUTTON.PADDING,
	},
});

export default MainTabs;
