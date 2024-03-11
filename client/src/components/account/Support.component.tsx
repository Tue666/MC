import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { Box } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const Support = () => {
	return (
		<View>
			{[...Array(5)].map((_, index) => {
				return (
					<Box key={index} style={[styles.support]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							Huyền thoại Đấu Nhanh
						</Text>
					</Box>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	support: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default Support;
