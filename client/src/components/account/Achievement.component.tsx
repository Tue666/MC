import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { Box } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const Achievement = () => {
	return (
		<View>
			{[...Array(5)].map((_, index) => {
				return (
					<Box key={index} style={[styles.achievement]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							Huyền thoại ??
						</Text>
						<Text variant="labelSmall" numberOfLines={2} style={[{ fontStyle: 'italic', height: 40 }]}>
							Chiến thắng liên tục 100 lần chế độ ???. Chiến thắng liên tục 100 lần chế độ ???. Chiến thắng liên
							tục 100 lần chế độ ???
						</Text>
					</Box>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	achievement: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default Achievement;
