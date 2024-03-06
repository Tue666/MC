import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { stackStyles } from '../../styles';
import { Box } from '..';

const Information = () => {
	const theme = useTheme();

	return (
		<Box style={[styles.container, stackStyles.row]}>
			<View style={[styles.detail]}>
				<Text variant="titleSmall" style={[{ fontWeight: 'bold' }]}>
					Lê Chính Tuệ
				</Text>
				<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
					Kim Cương (2 ⚜️)
				</Text>
				<Text variant="labelSmall" style={[{ fontStyle: 'italic', marginTop: 5 }]}>
					Đã tham gia vào Tháng 9 XX-XX-X
				</Text>
			</View>
			<View style={[styles.rank, stackStyles.center]}>
				<Icon name="token" size={130} color={theme.colors.primary} />
			</View>
		</Box>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
		paddingTop: 185 / 2,
		paddingHorizontal: 10,
		paddingBottom: 10,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	detail: {
		width: '65%',
		paddingRight: 40,
	},
	rank: {
		width: '35%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Information;
