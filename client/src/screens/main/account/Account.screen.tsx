import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Achievement, Avatar, Cover, Information, Statistics } from '../../../components';
import { AccountProps } from '../../../types';

const Account = (props: AccountProps) => {
	const theme = useTheme();

	return (
		<ScrollView>
			<View>
				<Icon name="settings" size={25} color={theme.colors.onPrimary} style={[styles.setting]} />
				<Cover />
				<Avatar size={150} style={[styles.avatar]} />
				<Information />
			</View>
			<View style={[{ marginTop: 20, padding: 10 }]}>
				<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
					Thống kê
				</Text>
				<Statistics />
			</View>
			<View style={[{ marginTop: 20, padding: 10 }]}>
				<Text variant="titleMedium" style={[{ fontWeight: 'bold' }]}>
					Thành tựu
				</Text>
				<Achievement />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	setting: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 9999,
	},
	avatar: {
		position: 'absolute',
		// backgroundColor: 'pink',
		top: 200 - 175 / 2,
		left: Dimensions.get('window').width / 2 - 190 / 2,
		zIndex: 9999,
	},
});

export default Account;
