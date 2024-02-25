import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConstantConfig } from '../../configs';
import { MainLayout } from '../../layouts';
import { useGlobalStyles, useStackStyles } from '../../styles';
import { MainTabList } from '../../types';
import { ConquerStack } from './conquer';
import { Account, Ranking } from '.';

const { MAIN_LAYOUT } = ConstantConfig;

const Tab = createBottomTabNavigator<MainTabList>();

const MainTab = () => {
	const theme = useTheme();
	const globalStyles = useGlobalStyles();
	const stackStyles = useStackStyles();

	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={({ state, descriptors, navigation }) => {
				const childrenStyles = state.routes.reduce((styles, route) => {
					const { options } = descriptors[route.key];
					const { tabBarStyle } = options;
					if (!tabBarStyle) return styles;

					return { ...styles, ...(tabBarStyle as Object) };
				}, {});
				return (
					<View
						style={{
							...styles.bar,
							...stackStyles.row,
							...globalStyles.paper,
							...globalStyles.shadow,
							...childrenStyles,
						}}
					>
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
				name="ConquerStack"
				options={{ tabBarIcon: ({ color, size }) => <Icon name="token" color={color} size={size} /> }}
			>
				{(props) => (
					<MainLayout {...props}>
						<ConquerStack {...props} />
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

export default MainTab;
