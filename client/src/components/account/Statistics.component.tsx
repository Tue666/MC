import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ConstantConfig } from '../../configs';
import { stackStyles } from '../../styles';
import { Box } from '..';

const { MAIN_LAYOUT } = ConstantConfig;

const WIDTH_SIZE = Dimensions.get('window').width;
const CONTAINER_WIDTH =
	WIDTH_SIZE - MAIN_LAYOUT.PADDING * 2 - MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING * 2;

const Statistics = () => {
	return (
		<View style={[stackStyles.rowWrap]}>
			{[...Array(5)].map((_, index) => {
				const statisticsWidth = (CONTAINER_WIDTH - (MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2) * 2 * 2) * 0.5;

				return (
					<Box key={index} style={[styles.statistics, { width: statisticsWidth }]}>
						<Text variant="labelSmall" style={[{ fontWeight: 'bold' }]}>
							???
						</Text>
						<Text variant="labelSmall" style={[{ fontStyle: 'italic' }]}>
							Ngày ???
						</Text>
					</Box>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	statistics: {
		padding: MAIN_LAYOUT.SCREENS.ACCOUNT.PADDING,
		margin: MAIN_LAYOUT.SCREENS.ACCOUNT.MARGIN / 2,
	},
});

export default Statistics;
