import { StyleSheet, View } from 'react-native';
import { Box } from '..';
import { Text } from 'react-native-paper';

const Achievement = () => {
	return (
		<View>
			{[...Array(5)].map((_, index) => {
				return (
					<Box key={index} style={[styles.achievement]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							Huyền thoại Đấu Nhanh
						</Text>
						<Text variant="labelSmall" style={[{ fontStyle: 'italic' }]}>
							Chiến thắng liên tục 100 lần chế độ Đấu Nhanh. Chiến thắng liên tục 100 lần chế độ Đấu Nhanh
						</Text>
					</Box>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	achievement: {
		padding: 10,
		margin: 5,
	},
});

export default Achievement;
